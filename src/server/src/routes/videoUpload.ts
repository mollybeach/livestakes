import { Router, Request, Response } from 'express';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import pool from '../database/db';
import ffmpeg from 'fluent-ffmpeg';
import VideoAnalysisService from '../services/videoAnalysis';
import { VideoMetadata } from '../services/videoAnalysis';

const router = Router();

// Initialize services
const videoAnalysisService = new VideoAnalysisService();

// Initialize GCP Storage if environment variables are present
let storageClient: Storage | null = null;
let bucketName = process.env.GCP_BUCKET_NAME || 'livestakes-videos';

try {
  // Check if GCP credentials are available
  if (process.env.GCP_PROJECT_ID && process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY) {
    storageClient = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }
    });
    console.log('Google Cloud Storage client initialized for videos');
    
    // Check if bucket exists and create it if it doesn't
    (async () => {
      try {
        if (storageClient) {
          const [bucketExists] = await storageClient.bucket(bucketName).exists();
          if (!bucketExists) {
            console.log(`Bucket ${bucketName} does not exist. Creating it now...`);
            await storageClient.createBucket(bucketName, {
              location: 'us-central1',
              storageClass: 'STANDARD'
            });
            // Make bucket public
            await storageClient.bucket(bucketName).makePublic();
            console.log(`Bucket ${bucketName} created successfully and made public`);
          } else {
            console.log(`Bucket ${bucketName} already exists`);
          }
        }
      } catch (bucketError) {
        console.error('Error checking/creating video bucket:', bucketError);
      }
    })();
  } else if (process.env.NODE_ENV === 'production') {
    console.warn('GCP credentials missing, but in production. Video uploads may not work correctly');
  } else {
    console.log('No GCP credentials found, will use local file storage for development');
  }
} catch (error) {
  console.error('Error initializing GCP Storage client:', error);
  storageClient = null;
}

// Ensure local temp directory exists for development
const LOCAL_TEMP_DIR = path.join(__dirname, '..', '..', 'temp', 'videos');
if (!storageClient && !fs.existsSync(LOCAL_TEMP_DIR)) {
  try {
    fs.mkdirSync(LOCAL_TEMP_DIR, { recursive: true });
    console.log(`Created local temp directory: ${LOCAL_TEMP_DIR}`);
  } catch (err) {
    console.error('Failed to create local temp directory:', err);
  }
}

// Configure multer for video file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Accept MP4 and MOV files
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/quicktime') {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 and MOV files are allowed'));
    }
  }
});

// Convert MOV buffer to MP4 buffer
function convertMovToMp4Buffer(inputBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const tempInputPath = path.join(LOCAL_TEMP_DIR, `temp_${uuidv4()}.mov`);
    const tempOutputPath = path.join(LOCAL_TEMP_DIR, `temp_${uuidv4()}.mp4`);
    
    try {
      // Write input buffer to temporary file
      fs.writeFileSync(tempInputPath, inputBuffer);
      
      console.log('Converting MOV to MP4...');
      
      ffmpeg(tempInputPath)
        .output(tempOutputPath)
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
            // Read the converted file
            const convertedBuffer = fs.readFileSync(tempOutputPath);
            
            // Clean up temporary files
            fs.unlinkSync(tempInputPath);
            fs.unlinkSync(tempOutputPath);
            
            console.log('✅ MOV to MP4 conversion completed');
            resolve(convertedBuffer);
          } catch (readError) {
            console.error('Error reading converted file:', readError);
            reject(readError);
          }
        })
        .on('error', (err) => {
          console.error(`❌ Conversion failed: ${err.message}`);
          // Clean up temporary files on error
          try {
            if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
            if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
          } catch (cleanupError) {
            console.warn('Could not clean up temporary files:', cleanupError);
          }
          reject(err);
        })
        .run();
    } catch (err) {
      console.error('Error setting up conversion:', err);
      reject(err);
    }
  });
}

// Simplified video upload - only requires video file and market address
router.post('/upload-video-simple', upload.single('video'), async (req: any, res: any) => {
  const { 
    market_address, 
    creator_wallet_address
  } = req.body;
  
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No video file provided'
    });
  }
  
  if (!market_address || !creator_wallet_address) {
    return res.status(400).json({
      success: false,
      error: 'Market address and creator wallet address are required'
    });
  }
  
  try {
    // Handle MOV to MP4 conversion if necessary
    let videoBuffer = req.file.buffer;
    let originalFilename = req.file.originalname;
    
    if (req.file.mimetype === 'video/quicktime') {
      console.log(`🔄 Converting MOV file: ${originalFilename}`);
      videoBuffer = await convertMovToMp4Buffer(req.file.buffer);
      console.log('✅ MOV to MP4 conversion completed');
    }
    
    // Always use AI analysis for automatic title/description generation
    let aiMetadata: VideoMetadata | null = null;
    try {
      console.log('🤖 Starting AI analysis of uploaded video...');
      aiMetadata = await videoAnalysisService.analyzeVideoFromBuffer(
        videoBuffer,
        originalFilename,
        {
          maxDurationForAnalysis: 300, // 5 minutes max
          includeTranscript: true
        }
      );
      console.log('✅ AI analysis completed');
    } catch (error) {
      console.error('❌ AI analysis failed:', error);
      // Continue without AI metadata
    }
    
    // Use AI-generated metadata if available, otherwise use defaults
    const finalTitle = aiMetadata?.title || `Hackathon Project - ${originalFilename}`;
    const finalDescription = aiMetadata?.description || 'Hackathon project video upload';
    const finalCategory = aiMetadata?.category || 'hackathon';
    
    // Generate unique filename
    const uniqueId = uuidv4();
    const truncatedWallet = creator_wallet_address.slice(0, 8);
    const timestamp = Date.now();
    const filename = `video_${truncatedWallet}_${timestamp}_${uniqueId}.mp4`;
    
    let videoUrl = '';
    
    // Upload to storage (GCP or local)
    if (storageClient) {
      try {
        // Check if the bucket exists, create if needed
        const [bucketExists] = await storageClient.bucket(bucketName).exists();
        
        if (!bucketExists) {
          console.log(`Bucket ${bucketName} not found during video upload, creating...`);
          await storageClient.createBucket(bucketName, {
            location: 'us-central1',
            storageClass: 'STANDARD'
          });
          await storageClient.bucket(bucketName).makePublic();
          console.log(`Bucket ${bucketName} created and made public`);
        }
        
        // Upload the file
        const bucket = storageClient.bucket(bucketName);
        const file = bucket.file(`videos/${filename}`);
        
        const fileMetadata: any = {
          contentType: 'video/mp4',
          metadata: {
            title: finalTitle,
            creatorWalletAddress: creator_wallet_address,
            category: finalCategory,
            uploadTimestamp: new Date().toISOString(),
            originalFilename: originalFilename,
            marketAddress: market_address,
            aiGenerated: 'true'
          }
        };

        await file.save(videoBuffer, fileMetadata);
        await file.makePublic();
        
        videoUrl = `https://storage.googleapis.com/${bucketName}/videos/${filename}`;
        console.log(`Uploaded video to GCP: ${videoUrl}`);
      } catch (gcpError: any) {
        console.error(`GCP upload error: ${gcpError.message}`);
        
        // Fallback to local storage
        const filePath = path.join(LOCAL_TEMP_DIR, filename);
        fs.writeFileSync(filePath, videoBuffer);
        videoUrl = `${process.env.PUBLIC_API_URL || 'http://localhost:3334'}/api/videos/${filename}`;
        console.log(`Stored video locally as fallback: ${filePath}`);
      }
    } else {
      // Local file storage for development
      const filePath = path.join(LOCAL_TEMP_DIR, filename);
      fs.writeFileSync(filePath, videoBuffer);
      videoUrl = `${process.env.PUBLIC_API_URL || 'http://localhost:3334'}/api/videos/${filename}`;
      console.log(`Stored video locally: ${filePath}`);
    }
    
    // Create new livestream entry and associate with market
    const insertResult = await pool.query(
      `INSERT INTO livestreams (
        title, description, creator_wallet_address, stream_url, 
        thumbnail_url, status, category, tags, transcript, market_address,
        start_time, end_time, view_count
      ) VALUES ($1, $2, $3, $4, $5, 'ended', $6, $7, $8, $9, NOW(), NOW(), 0)
      RETURNING *`,
      [
        finalTitle, 
        finalDescription, 
        creator_wallet_address, 
        videoUrl, 
        null, // thumbnail_url
        finalCategory,
        aiMetadata?.tags ? JSON.stringify(aiMetadata.tags) : null,
        aiMetadata?.transcript,
        market_address
      ]
    );
    
    const livestreamResult = insertResult.rows[0];
    
    // Prepare response
    const response: any = {
      success: true,
      message: 'Video uploaded and processed successfully! 🎉',
      videoUrl,
      livestream: livestreamResult
    };
    
    // Include AI analysis results
    if (aiMetadata) {
      response.aiAnalysis = {
        title: aiMetadata.title,
        description: aiMetadata.description,
        category: aiMetadata.category,
        tags: aiMetadata.tags,
        transcript: aiMetadata.transcript
      };
    }
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error uploading video:', error);
    return res.status(500).json({
      success: false,
      error: `Server error: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

// Original upload endpoint (keeping for backward compatibility)
router.post('/upload-video', upload.single('video'), async (req: any, res: any) => {
  const { 
    title, 
    description, 
    creator_wallet_address, 
    category, 
    thumbnail_url,
    livestream_id, // Optional: update existing livestream
    use_ai_analysis, // Optional: enable AI analysis
    max_analysis_duration, // Optional: limit analysis duration
    include_transcript // Optional: include transcript in response
  } = req.body;
  
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No video file provided'
    });
  }
  
  if (!title || !creator_wallet_address) {
    return res.status(400).json({
      success: false,
      error: 'Title and creator wallet address are required'
    });
  }
  
  try {
    // Handle MOV to MP4 conversion if necessary
    let videoBuffer = req.file.buffer;
    let originalFilename = req.file.originalname;
    
    if (req.file.mimetype === 'video/quicktime') {
      console.log(`🔄 Converting MOV file: ${originalFilename}`);
      videoBuffer = await convertMovToMp4Buffer(req.file.buffer);
      console.log('✅ MOV to MP4 conversion completed');
    }
    
    // AI Analysis (if enabled)
    let aiMetadata: VideoMetadata | null = null;
    console.log('use_ai_analysis', use_ai_analysis);
    if (use_ai_analysis === 'true' || use_ai_analysis === true) {
      try {
        console.log('🤖 Starting AI analysis of uploaded video...');
        aiMetadata = await videoAnalysisService.analyzeVideoFromBuffer(
          videoBuffer,
          originalFilename,
          {
            maxDurationForAnalysis: max_analysis_duration ? parseInt(max_analysis_duration) : 300,
            includeTranscript: include_transcript === 'true' || include_transcript === true
          }
        );
        console.log('✅ AI analysis completed');
      } catch (error) {
        console.error('❌ AI analysis failed:', error);
        // Continue without AI metadata
      }
    }
    
    // Use AI-generated metadata if available, otherwise use provided values
    const finalTitle = title || aiMetadata?.title || 'Untitled Video';
    const finalDescription = description || aiMetadata?.description || 'Imported video';
    const finalCategory = category || aiMetadata?.category || 'general';
    
    // Generate unique filename
    const uniqueId = uuidv4();
    const truncatedWallet = creator_wallet_address.slice(0, 8);
    const timestamp = Date.now();
    const filename = `video_${truncatedWallet}_${timestamp}_${uniqueId}.mp4`;
    
    let videoUrl = '';
    
    // If GCP storage is available, upload to bucket
    if (storageClient) {
      try {
        // Check if the bucket exists, create if needed
        const [bucketExists] = await storageClient.bucket(bucketName).exists();
        
        if (!bucketExists) {
          console.log(`Bucket ${bucketName} not found during video upload, creating...`);
          try {
            await storageClient.createBucket(bucketName, {
              location: 'us-central1',
              storageClass: 'STANDARD'
            });
            console.log(`Bucket ${bucketName} created successfully`);
            
            // Make it public
            await storageClient.bucket(bucketName).makePublic();
            console.log(`Bucket ${bucketName} made public`);
          } catch (createError: any) {
            console.error(`Failed to create bucket: ${createError}`);
            throw new Error(`Bucket creation failed: ${createError.message}`);
          }
        }
        
        // Upload the file
        const bucket = storageClient.bucket(bucketName);
        const file = bucket.file(`videos/${filename}`);
        
        const fileMetadata: any = {
          contentType: 'video/mp4',
          metadata: {
            title: finalTitle,
            creatorWalletAddress: creator_wallet_address,
            category: finalCategory,
            uploadTimestamp: new Date().toISOString(),
            originalFilename: originalFilename,
            aiGenerated: aiMetadata ? 'true' : 'false'
          }
        };

        await file.save(videoBuffer, fileMetadata);
        
        // Make file public
        await file.makePublic();
        
        // Get public URL
        videoUrl = `https://storage.googleapis.com/${bucketName}/videos/${filename}`;
        console.log(`Uploaded video to GCP: ${videoUrl}`);
      } catch (gcpError: any) {
        console.error(`GCP upload error: ${gcpError.message}`);
        
        // Fallback to local storage if GCP fails
        console.log('Falling back to local storage after GCP failure');
        const filePath = path.join(LOCAL_TEMP_DIR, filename);
        fs.writeFileSync(filePath, videoBuffer);
        
        // For local development, we'll return a URL to the public API endpoint
        videoUrl = `${process.env.PUBLIC_API_URL || 'http://localhost:3334'}/api/videos/${filename}`;
        console.log(`Stored video locally as fallback: ${filePath}`);
      }
    } else {
      // Local file storage for development
      const filePath = path.join(LOCAL_TEMP_DIR, filename);
      fs.writeFileSync(filePath, videoBuffer);
      
      // For local development, we'll return a URL to the public API endpoint
      videoUrl = `${process.env.PUBLIC_API_URL || 'http://localhost:3334'}/api/videos/${filename}`;
      console.log(`Stored video locally: ${filePath}`);
    }
    
    // Update existing livestream or create new one
    let livestreamResult;
    
    if (livestream_id) {
      // Update existing livestream with video URL
      const updateResult = await pool.query(
        `UPDATE livestreams 
         SET stream_url = $1, status = 'ended', end_time = NOW(), updated_at = NOW()
         WHERE id = $2 AND creator_wallet_address = $3
         RETURNING *`,
        [videoUrl, livestream_id, creator_wallet_address]
      );
      
      if (updateResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Livestream not found or you do not have permission to update it'
        });
      }
      
      livestreamResult = updateResult.rows[0];
    } else {
      // Create new livestream entry
      const insertResult = await pool.query(
        `INSERT INTO livestreams (
          title, description, creator_wallet_address, stream_url, 
          thumbnail_url, status, category, tags, transcript, start_time, end_time, view_count
        ) VALUES ($1, $2, $3, $4, $5, 'ended', $6, $7, $8, NOW(), NOW(), 0)
        RETURNING *`,
        [
          finalTitle, 
          finalDescription, 
          creator_wallet_address, 
          videoUrl, 
          thumbnail_url, 
          finalCategory,
          aiMetadata?.tags ? JSON.stringify(aiMetadata.tags) : null,
          aiMetadata?.transcript
        ]
      );
      
      livestreamResult = insertResult.rows[0];
    }
    
    // Prepare response
    const response: any = {
      success: true,
      message: 'Video uploaded successfully',
      videoUrl,
      livestream: livestreamResult
    };
    
    // Include AI analysis results if available
    if (aiMetadata) {
      response.aiAnalysis = {
        title: aiMetadata.title,
        description: aiMetadata.description,
        category: aiMetadata.category,
        tags: aiMetadata.tags,
        ...(aiMetadata.transcript && { transcript: aiMetadata.transcript })
      };
    }
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error uploading video:', error);
    return res.status(500).json({
      success: false,
      error: `Server error: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

// Serve locally stored videos in development
router.get('/videos/:filename', (req: any, res: any) => {
  const { filename } = req.params;
  
  // Security check - only allow MP4 files with the expected naming pattern
  if (!filename.match(/^video_[a-zA-Z0-9]{4,8}_\d+_[a-f0-9-]+\.mp4$/)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid video filename pattern'
    });
  }
  
  const filePath = path.join(LOCAL_TEMP_DIR, filename);
  
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for video streaming
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Serve the entire file
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    return res.status(404).json({
      success: false,
      error: 'Video not found'
    });
  }
});

export default router; 