#!/usr/bin/env node

import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import pool from '../database/db';
import ffmpeg from 'fluent-ffmpeg';
import VideoAnalysisService from '../services/videoAnalysis';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

interface VideoImportConfig {
  inputDirectory: string;
  creatorWalletAddress: string;
  category?: string;
  defaultThumbnail?: string;
  useAIAnalysis?: boolean;
  maxAnalysisDuration?: number; // in seconds, default 300 (5 minutes)
  includeTranscript?: boolean;
}

interface VideoMetadata {
  filename: string;
  title: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
  tags?: string[];
  transcript?: string;
}

class VideoImporter {
  private storageClient: Storage | null = null;
  private bucketName: string = process.env.GCP_BUCKET_NAME || 'livestakes-videos';
  private videoAnalysisService: VideoAnalysisService;

  constructor() {
    this.initializeStorage();
    this.videoAnalysisService = new VideoAnalysisService();
  }

  private async initializeStorage() {
    try {
      if (process.env.GCP_PROJECT_ID && process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY) {
        this.storageClient = new Storage({
          projectId: process.env.GCP_PROJECT_ID,
          credentials: {
            client_email: process.env.GCP_CLIENT_EMAIL,
            private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }
        });
        console.log('Google Cloud Storage client initialized');
        
        // Ensure bucket exists
        await this.ensureBucketExists();
      } else {
        console.warn('GCP credentials not found. Videos will not be uploaded to cloud storage.');
      }
    } catch (error) {
      console.error('Error initializing GCP Storage:', error);
      this.storageClient = null;
    }
  }

  private async ensureBucketExists() {
    if (!this.storageClient) return;

    try {
      const [bucketExists] = await this.storageClient.bucket(this.bucketName).exists();
      if (!bucketExists) {
        console.log(`Creating bucket ${this.bucketName}...`);
        await this.storageClient.createBucket(this.bucketName, {
          location: 'us-central1',
          storageClass: 'STANDARD'
        });
        await this.storageClient.bucket(this.bucketName).makePublic();
        console.log(`Bucket ${this.bucketName} created and made public`);
      } else {
        console.log(`Bucket ${this.bucketName} already exists`);
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      throw error;
    }
  }

  private async uploadVideoToGCP(filePath: string, filename: string, metadata: VideoMetadata): Promise<string> {
    if (!this.storageClient) {
      throw new Error('GCP Storage not initialized');
    }

    console.log(`Uploading ${filename} to GCP...`);
    
    const bucket = this.storageClient.bucket(this.bucketName);
    const file = bucket.file(`videos/${filename}`);
    
    const fileMetadata = {
      contentType: 'video/mp4',
      metadata: {
        title: metadata.title,
        category: metadata.category || 'general',
        uploadTimestamp: new Date().toISOString(),
        originalFilename: metadata.filename
      }
    };

    await file.save(fs.readFileSync(filePath), fileMetadata);
    await file.makePublic();
    
    const videoUrl = `https://storage.googleapis.com/${this.bucketName}/videos/${filename}`;
    console.log(`Successfully uploaded: ${videoUrl}`);
    
    return videoUrl;
  }

  private async createLivestreamEntry(
    videoUrl: string, 
    metadata: VideoMetadata, 
    creatorWalletAddress: string
  ): Promise<any> {
    console.log(`Creating livestream entry for ${metadata.title}...`);
    
    const result = await pool.query(
      `INSERT INTO livestreams (
        title, description, creator_wallet_address, stream_url, 
        thumbnail_url, status, category, tags, transcript, start_time, end_time, view_count
      ) VALUES ($1, $2, $3, $4, $5, 'ended', $6, $7, $8, NOW(), NOW(), 0)
      RETURNING *`,
      [
        metadata.title,
        metadata.description,
        creatorWalletAddress,
        videoUrl,
        metadata.thumbnailUrl,
        metadata.category || 'general',
        metadata.tags ? JSON.stringify(metadata.tags) : null,
        metadata.transcript
      ]
    );
    
    console.log(`Created livestream entry with ID: ${result.rows[0].id}`);
    return result.rows[0];
  }

  private async convertMovToMp4(inputPath: string): Promise<string> {
    const outputPath = inputPath.replace(/\.mov$/i, '.mp4');
    
    console.log(`Converting ${inputPath} to MP4...`);
    
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .format('mp4')
        .on('start', (commandLine) => {
          console.log('FFmpeg command: ' + commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Conversion progress: ${Math.round(progress.percent || 0)}%`);
        })
        .on('end', () => {
          try {
            // Replace the original MOV file with the MP4 version
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(inputPath); // Delete the original MOV file
              console.log(`🗑️ Deleted original MOV file: ${inputPath}`);
              console.log(`✅ Conversion completed and MOV replaced with MP4: ${outputPath}`);
              resolve(outputPath);
            } else {
              reject(new Error('Converted MP4 file not found'));
            }
          } catch (error) {
            console.error(`❌ Error replacing MOV file: ${error}`);
            reject(error);
          }
        })
        .on('error', (err) => {
          console.error(`❌ Conversion failed: ${err.message}`);
          reject(err);
        })
        .run();
    });
  }

  private parseVideoMetadata(filename: string): VideoMetadata {
    // Remove extension
    const nameWithoutExt = path.parse(filename).name;
    
    // Try to extract meaningful title from filename
    // Replace underscores and dashes with spaces, capitalize first letter
    const title = nameWithoutExt
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
    
    return {
      filename,
      title: title || nameWithoutExt,
      description: `Imported video: ${title}`,
    };
  }

  private async parseVideoMetadataWithAI(
    filePath: string,
    filename: string,
    options: {
      maxAnalysisDuration?: number;
      includeTranscript?: boolean;
    } = {}
  ): Promise<VideoMetadata> {
    try {
      console.log(`🤖 Analyzing video with AI: ${filename}`);
      
      const aiMetadata = await this.videoAnalysisService.analyzeVideo(filePath, {
        maxDurationForAnalysis: options.maxAnalysisDuration || 300,
        includeTranscript: options.includeTranscript || false,
      });

      return {
        filename,
        title: aiMetadata.title,
        description: aiMetadata.description,
        category: aiMetadata.category,
        tags: aiMetadata.tags,
        transcript: aiMetadata.transcript
      };
    } catch (error) {
      console.error(`❌ AI analysis failed for ${filename}:`, error);
      console.log('Falling back to basic metadata parsing');
      
      // Fallback to basic parsing
      return this.parseVideoMetadata(filename);
    }
  }

  public async importVideosFromDirectory(config: VideoImportConfig): Promise<void> {
    const { 
      inputDirectory, 
      creatorWalletAddress, 
      category, 
      defaultThumbnail,
      useAIAnalysis = false,
      maxAnalysisDuration = 300,
      includeTranscript = false
    } = config;
    
    console.log(`Starting video import from directory: ${inputDirectory}`);
    console.log(`Creator wallet address: ${creatorWalletAddress}`);
    
    if (!fs.existsSync(inputDirectory)) {
      throw new Error(`Input directory does not exist: ${inputDirectory}`);
    }

    // Get all MP4 and MOV files in the directory
    const files = fs.readdirSync(inputDirectory)
      .filter(file => {
        const ext = file.toLowerCase();
        return ext.endsWith('.mp4') || ext.endsWith('.mov');
      });
    
    if (files.length === 0) {
      console.log('No MP4 or MOV files found in the directory');
      return;
    }
    
    console.log(`Found ${files.length} video files to import (MP4/MOV)`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      try {
        let filePath = path.join(inputDirectory, file);
        let finalFile = file;
        
        // Convert MOV to MP4 if necessary
        if (file.toLowerCase().endsWith('.mov')) {
          console.log(`\n🔄 Converting MOV file: ${file}`);
          filePath = await this.convertMovToMp4(filePath);
          finalFile = path.basename(filePath); // Update filename to MP4
        }
        
        // Generate metadata (with AI analysis if enabled)
        const metadata = useAIAnalysis 
          ? await this.parseVideoMetadataWithAI(filePath, finalFile, {
              maxAnalysisDuration,
              includeTranscript
            })
          : this.parseVideoMetadata(finalFile);
        
        // Override metadata with config values
        if (category) metadata.category = category;
        if (defaultThumbnail) metadata.thumbnailUrl = defaultThumbnail;
        
        // Generate unique filename for storage
        const uniqueId = uuidv4();
        const truncatedWallet = creatorWalletAddress.slice(0, 8);
        const timestamp = Date.now();
        const storageFilename = `video_${truncatedWallet}_${timestamp}_${uniqueId}.mp4`;
        
        let videoUrl: string;
        
        if (this.storageClient) {
          // Upload to GCP
          videoUrl = await this.uploadVideoToGCP(filePath, storageFilename, metadata);
        } else {
          // For development, just use a placeholder URL
          videoUrl = `http://localhost:3334/api/videos/${storageFilename}`;
          console.log(`GCP not available, using placeholder URL: ${videoUrl}`);
        }
        
        // Create database entry
        await this.createLivestreamEntry(videoUrl, metadata, creatorWalletAddress);
        
        successCount++;
        console.log(`✅ Successfully imported: ${finalFile} (${successCount}/${files.length})`);
        
        // Note: For MOV files, the original file has been permanently replaced with MP4
        // No cleanup needed as the MOV file is already deleted and replaced
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to import ${file}:`, error);
      }
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`✅ Successfully imported: ${successCount} videos`);
    console.log(`❌ Failed to import: ${errorCount} videos`);
    console.log(`📁 Total files processed: ${files.length}`);
  }

  public async importSingleVideo(
    filePath: string, 
    title: string, 
    creatorWalletAddress: string,
    options: {
      description?: string;
      category?: string;
      thumbnailUrl?: string;
      useAIAnalysis?: boolean;
      maxAnalysisDuration?: number;
      includeTranscript?: boolean;
    } = {}
  ): Promise<any> {
    console.log(`Importing single video: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    
    const filename = path.basename(filePath);
    const extension = filename.toLowerCase();
    if (!extension.endsWith('.mp4') && !extension.endsWith('.mov')) {
      throw new Error('File must be an MP4 or MOV video');
    }
    
    let actualFilePath = filePath;
    let finalFilename = filename;
    
    // Convert MOV to MP4 if necessary
    if (extension.endsWith('.mov')) {
      console.log(`🔄 Converting MOV file: ${filename}`);
      actualFilePath = await this.convertMovToMp4(filePath);
      finalFilename = path.basename(actualFilePath);
    }
    
    let metadata: VideoMetadata;
    
    if (options.useAIAnalysis) {
      console.log(`🤖 Using AI analysis for: ${finalFilename}`);
      try {
        const aiMetadata = await this.parseVideoMetadataWithAI(actualFilePath, finalFilename, {
          maxAnalysisDuration: options.maxAnalysisDuration || 300,
          includeTranscript: options.includeTranscript || false
        });
        
        // Override AI-generated metadata with user-provided values
        metadata = {
          ...aiMetadata,
          title: title, // Keep user-provided title
          description: options.description || aiMetadata.description,
          category: options.category || aiMetadata.category,
          thumbnailUrl: options.thumbnailUrl || aiMetadata.thumbnailUrl
        };
      } catch (error) {
        console.error('AI analysis failed, using provided metadata:', error);
        metadata = {
          filename: finalFilename,
          title,
          description: options.description || `Imported video: ${title}`,
          category: options.category || 'general',
          thumbnailUrl: options.thumbnailUrl
        };
      }
    } else {
      metadata = {
        filename: finalFilename,
        title,
        description: options.description || `Imported video: ${title}`,
        category: options.category || 'general',
        thumbnailUrl: options.thumbnailUrl
      };
    }
    
    // Generate unique filename for storage
    const uniqueId = uuidv4();
    const truncatedWallet = creatorWalletAddress.slice(0, 8);
    const timestamp = Date.now();
    const storageFilename = `video_${truncatedWallet}_${timestamp}_${uniqueId}.mp4`;
    
    let videoUrl: string;
    
    if (this.storageClient) {
      videoUrl = await this.uploadVideoToGCP(actualFilePath, storageFilename, metadata);
    } else {
      videoUrl = `http://localhost:3334/api/videos/${storageFilename}`;
      console.log(`GCP not available, using placeholder URL: ${videoUrl}`);
    }
    
    const livestreamEntry = await this.createLivestreamEntry(videoUrl, metadata, creatorWalletAddress);
    
    // Note: For MOV files, the original file has been permanently replaced with MP4
    // No cleanup needed as the MOV file is already deleted and replaced
    
    console.log(`✅ Successfully imported video: ${title}`);
    return livestreamEntry;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
📹 Video Import Script for livestakes.fun

Usage:
  # Import all MP4/MOV files from a directory
  npm run import-videos <directory> <creator_wallet_address> [category] [thumbnail_url] [--ai-analysis] [--max-duration=300] [--include-transcript]
  
  # Import single video file (MP4 or MOV)
  npm run import-video <file_path> <title> <creator_wallet_address> [description] [category] [thumbnail_url] [--ai-analysis] [--max-duration=300] [--include-transcript]

Examples:
  npm run import-videos ./videos 0x1234567890123456789012345678901234567890 gaming
  npm run import-video ./video.mp4 "Epic Gaming Session" 0x1234... "Amazing gameplay" gaming
  npm run import-video ./video.mov "Cool MOV Video" 0x1234... "Auto-converted to MP4" gaming
  
  # With AI analysis
  npm run import-videos ./videos 0x1234... gaming "" --ai-analysis
  npm run import-video ./video.mp4 "My Video" 0x1234... "" "" "" --ai-analysis --max-duration=180

Features:
  - Automatically converts MOV files to MP4 using ffmpeg
  - Uploads to Google Cloud Storage (with local fallback)
  - Creates database entries for livestream interface
  - Supports bulk directory import and single file import
  - AI-powered metadata generation using OpenAI Whisper + GPT-4

AI Analysis Options:
  --ai-analysis: Enable AI-powered title, description, and category generation
  --max-duration=N: Limit audio analysis to N seconds (default: 300)
  --include-transcript: Include full transcript in database

Environment Variables Required:
  - GCP_PROJECT_ID
  - GCP_CLIENT_EMAIL  
  - GCP_PRIVATE_KEY
  - GCP_BUCKET_NAME (optional, defaults to 'livestakes-videos')
  - POSTGRES_* variables for database connection
  - OPENAI_API_KEY (required for AI analysis)
    `);
    process.exit(1);
  }

  const importer = new VideoImporter();
  
  try {
    // Parse command line arguments
    const regularArgs = args.filter(arg => !arg.startsWith('--'));
    const flags = args.filter(arg => arg.startsWith('--'));
    
    // Parse flags
    const useAIAnalysis = true;
    const includeTranscript = true;
    const maxDurationFlag = flags.find(flag => flag.startsWith('--max-duration='));
    const maxAnalysisDuration = maxDurationFlag ? parseInt(maxDurationFlag.split('=')[1]) : 300;
    
    console.log(`🤖 AI Analysis: ${useAIAnalysis ? 'ENABLED' : 'DISABLED'}`);
    if (useAIAnalysis) {
      console.log(`📊 Max Analysis Duration: ${maxAnalysisDuration} seconds`);
      console.log(`📝 Include Transcript: ${includeTranscript ? 'YES' : 'NO'}`);
    }
    
    const [pathArg, creatorWallet, ...otherArgs] = regularArgs;
    
    // Check if it's a directory (bulk import) or file (single import)
    const isDirectory = fs.existsSync(pathArg) && fs.statSync(pathArg).isDirectory();
    
    if (isDirectory) {
      // Bulk import
      const [category, thumbnailUrl] = otherArgs;
      
      await importer.importVideosFromDirectory({
        inputDirectory: pathArg,
        creatorWalletAddress: creatorWallet,
        category,
        defaultThumbnail: thumbnailUrl,
        useAIAnalysis,
        maxAnalysisDuration,
        includeTranscript
      });
    } else {
      // Single import
      const [title, description, category, thumbnailUrl] = otherArgs;
      
      if (!title) {
        console.error('Title is required for single video import');
        process.exit(1);
      }
      
      await importer.importSingleVideo(pathArg, title, creatorWallet, {
        description,
        category,
        thumbnailUrl,
        useAIAnalysis,
        maxAnalysisDuration,
        includeTranscript
      });
    }
    
    console.log('\n🎉 Import completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  }
}

// Export for programmatic use
export default VideoImporter;

// Run if called directly
if (require.main === module) {
  main();
} 