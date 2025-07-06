#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

interface VideoImportConfig {
  inputDirectory: string;
  creatorWalletAddress: string;
  marketAddress: string;
  apiBaseUrl?: string;
}

interface VideoUploadResponse {
  success: boolean;
  message?: string;
  error?: string;
  videoUrl?: string;
  livestream?: any;
  aiAnalysis?: any;
}

class VideoImporter {
  private apiBaseUrl: string;
  private defaultMarketAddress: string;

  constructor(apiBaseUrl?: string, marketAddress?: string) {
    this.apiBaseUrl = apiBaseUrl || process.env.API_BASE_URL || 'https://livestakes.fun/api';
    this.defaultMarketAddress = marketAddress || '0xb6B14E5651AE3637A81012024E3F7fEF0526fb6f';
    console.log(`📡 Using API Base URL: ${this.apiBaseUrl}`);
    console.log(`📄 Using Market Address: ${this.defaultMarketAddress}`);
  }

  private async uploadVideoViaAPI(
    filePath: string,
    marketAddress: string,
    creatorWalletAddress: string
  ): Promise<VideoUploadResponse> {
    console.log(`📤 Uploading ${path.basename(filePath)} via API...`);
    
    const formData = new FormData();
    formData.append('video', fs.createReadStream(filePath));
    formData.append('market_address', marketAddress);
    formData.append('creator_wallet_address', creatorWalletAddress);

    const response = await fetch(`${this.apiBaseUrl}/upload-video-simple`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const result = await response.json() as VideoUploadResponse;
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return result;
  }

  public async importVideosFromDirectory(config: VideoImportConfig): Promise<void> {
    const { 
      inputDirectory, 
      creatorWalletAddress, 
      marketAddress = this.defaultMarketAddress
    } = config;
    
    console.log(`🎬 Starting video import from directory: ${inputDirectory}`);
    console.log(`👤 Creator wallet address: ${creatorWalletAddress}`);
    console.log(`📊 Market address: ${marketAddress}`);
    
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
    
    // Sort files by size (smallest first)
    const filesWithSize = files.map(file => {
      const filePath = path.join(inputDirectory, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeFormatted: (stats.size / 1024 / 1024).toFixed(1) + ' MB'
      };
    }).sort((a, b) => a.size - b.size);
    
    console.log(`📁 Found ${filesWithSize.length} video files to import (MP4/MOV)`);
    console.log('📏 Files ordered by size (smallest first):');
    filesWithSize.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.name} (${file.sizeFormatted})`);
    });
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const fileInfo of filesWithSize) {
      try {
        const filePath = path.join(inputDirectory, fileInfo.name);
        
        console.log(`\n🎯 Processing: ${fileInfo.name} (${fileInfo.sizeFormatted})`);
        
        // Upload via API (handles MOV conversion, AI analysis, GCP upload, and database creation)
        const result = await this.uploadVideoViaAPI(filePath, marketAddress, creatorWalletAddress);
        
        if (result.success) {
          successCount++;
          console.log(`✅ Successfully imported: ${fileInfo.name} (${successCount}/${filesWithSize.length})`);
          console.log(`   📹 Video URL: ${result.videoUrl}`);
          console.log(`   🆔 Livestream ID: ${result.livestream?.id}`);
          
          if (result.aiAnalysis) {
            console.log(`   🤖 AI Generated Title: ${result.aiAnalysis.title}`);
            console.log(`   📝 AI Generated Description: ${result.aiAnalysis.description}`);
            console.log(`   🏷️ AI Generated Category: ${result.aiAnalysis.category}`);
          }
        } else {
          errorCount++;
          console.error(`❌ Failed to import ${fileInfo.name}: ${result.error}`);
        }
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to import ${fileInfo.name}:`, error);
      }
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`✅ Successfully imported: ${successCount} videos`);
    console.log(`❌ Failed to import: ${errorCount} videos`);
    console.log(`📁 Total files processed: ${filesWithSize.length}`);
  }

  public async importSingleVideo(
    filePath: string,
    creatorWalletAddress: string,
    marketAddress: string = this.defaultMarketAddress
  ): Promise<any> {
    console.log(`🎬 Importing single video: ${filePath}`);
    console.log(`👤 Creator wallet: ${creatorWalletAddress}`);
    console.log(`📊 Market address: ${marketAddress}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    
    const filename = path.basename(filePath);
    const extension = filename.toLowerCase();
    if (!extension.endsWith('.mp4') && !extension.endsWith('.mov')) {
      throw new Error('File must be an MP4 or MOV video');
    }
    
    // Upload via API
    const result = await this.uploadVideoViaAPI(filePath, marketAddress, creatorWalletAddress);
    
    if (result.success) {
      console.log(`✅ Successfully imported video: ${filename}`);
      console.log(`📹 Video URL: ${result.videoUrl}`);
      console.log(`🆔 Livestream ID: ${result.livestream?.id}`);
      
      if (result.aiAnalysis) {
        console.log(`🤖 AI Analysis Results:`);
        console.log(`   Title: ${result.aiAnalysis.title}`);
        console.log(`   Description: ${result.aiAnalysis.description}`);
        console.log(`   Category: ${result.aiAnalysis.category}`);
        console.log(`   Tags: ${result.aiAnalysis.tags?.join(', ') || 'None'}`);
      }
      
      return result.livestream;
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log(`
📹 Video Import Script for livestakes.fun (API Version)

Usage:
  # Import all MP4/MOV files from the videos directory (default)
  npm run import-videos <creator_wallet_address>
  
  # Import from custom directory
  npm run import-videos <creator_wallet_address> <directory>
  
  # Import single video file
  npm run import-video <creator_wallet_address> <file_path>

Examples:
  # Import all videos from default ./videos directory
  npm run import-videos 0x1234567890123456789012345678901234567890
  
  # Import from custom directory
  npm run import-videos 0x1234567890123456789012345678901234567890 ./my-videos
  
  # Import single video
  npm run import-video 0x1234567890123456789012345678901234567890 ./video.mp4

Features:
  - Uses API endpoint for upload (handles MOV conversion, AI analysis, GCP upload)
  - Automatically generates titles, descriptions, and categories using AI
  - Associates videos with hackathon market: ${'0xb6B14E5651AE3637A81012024E3F7fEF0526fb6f'}
  - Supports bulk directory import and single file import
  - Full transcript generation and metadata extraction

Environment Variables:
  - API_BASE_URL (optional, defaults to http://localhost:3334/api)
  - DEFAULT_MARKET_ADDRESS (optional, defaults to hackathon contract)

Note: All backend processing (GCP upload, database creation, AI analysis) is handled by the API.
    `);
    process.exit(1);
  }

  const importer = new VideoImporter();
  
  try {
    const [creatorWallet, pathArg] = args;
    
    if (!creatorWallet) {
      console.error('❌ Creator wallet address is required');
      process.exit(1);
    }
    
    // Default to videos directory if no path provided
    const inputPath = pathArg || path.join(__dirname, '..', '..', 'videos');
    
    // Check if it's a directory (bulk import) or file (single import)
    const isDirectory = fs.existsSync(inputPath) && fs.statSync(inputPath).isDirectory();
    
    if (isDirectory) {
      // Bulk import
      await importer.importVideosFromDirectory({
        inputDirectory: inputPath,
        creatorWalletAddress: creatorWallet,
        marketAddress: '0xb6B14E5651AE3637A81012024E3F7fEF0526fb6f'
      });
    } else {
      // Single import
      await importer.importSingleVideo(
        inputPath,
        creatorWallet,
        '0xb6B14E5651AE3637A81012024E3F7fEF0526fb6f'
      );
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