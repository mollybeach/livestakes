import OpenAI from 'openai';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface VideoMetadata {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  transcript?: string;
}

interface AnalysisOptions {
  includeTranscript?: boolean;
  maxDurationForAnalysis?: number; // in seconds, default 300 (5 minutes)
  language?: string; // for Whisper, default 'en'
}

class VideoAnalysisService {
  private openai: OpenAI | null = null;
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(__dirname, '..', '..', 'temp', 'analysis');
    this.initializeOpenAI();
    this.ensureTempDirectory();
  }

  private initializeOpenAI() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('OpenAI client initialized for video analysis');
    } else {
      console.warn('OpenAI API key not found. Video analysis will be disabled.');
    }
  }

  private ensureTempDirectory() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Extract audio from video file
   */
  private async extractAudio(videoPath: string, maxDuration?: number): Promise<string> {
    const audioPath = path.join(this.tempDir, `audio_${uuidv4()}.wav`);
    
    return new Promise((resolve, reject) => {
      let command = ffmpeg(videoPath)
        .audioCodec('pcm_s16le')
        .audioFrequency(16000)
        .audioChannels(1)
        .format('wav')
        .output(audioPath);

      // Limit duration if specified
      if (maxDuration) {
        command = command.duration(maxDuration);
      }

      command
        .on('start', (commandLine) => {
          console.log('Extracting audio:', commandLine);
        })
        .on('end', () => {
          console.log('✅ Audio extraction completed');
          resolve(audioPath);
        })
        .on('error', (err) => {
          console.error('❌ Audio extraction failed:', err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Transcribe audio using OpenAI Whisper
   */
  private async transcribeAudio(audioPath: string, language: string = 'en'): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    console.log('🎤 Transcribing audio with Whisper...');
    
    const transcription = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      language: language,
      response_format: 'text',
    });

    console.log('✅ Audio transcription completed');
    return transcription;
  }

  /**
   * Generate metadata from transcript using GPT
   */
  private async generateMetadataFromTranscript(
    transcript: string, 
    originalFilename?: string
  ): Promise<Omit<VideoMetadata, 'transcript'>> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    console.log('🧠 Generating metadata from transcript...');

    const prompt = `
Analyze this video transcript and generate appropriate metadata for a livestream/video platform. 
${originalFilename ? `Original filename: "${originalFilename}"` : ''}

Transcript:
"${transcript}"

Please provide:
1. A compelling, descriptive title (max 60 characters)
2. An engaging description (max 200 characters) 
3. The most appropriate category from: gaming, entertainment, education, sports, music, technology, lifestyle, news, art, cooking, fitness, travel, business, comedy, science, other
4. Up to 5 relevant tags

Format your response as valid JSON:
{
  "title": "...",
  "description": "...", 
  "category": "...",
  "tags": ["tag1", "tag2", "tag3"]
}

Make the title and description engaging and clickable while accurately representing the content.
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content creator who specializes in creating engaging titles and descriptions for videos. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No response from GPT');
    }

    try {
      const metadata = JSON.parse(responseText);
      console.log('✅ Metadata generation completed');
      return metadata;
    } catch (error) {
      console.error('Failed to parse GPT response:', responseText);
      throw new Error('Invalid JSON response from GPT');
    }
  }

  /**
   * Generate fallback metadata when LLM analysis fails
   */
  private generateFallbackMetadata(originalFilename?: string): Omit<VideoMetadata, 'transcript'> {
    const baseName = originalFilename ? path.parse(originalFilename).name : 'Video';
    const cleanName = baseName.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return {
      title: cleanName.length > 60 ? cleanName.substring(0, 57) + '...' : cleanName,
      description: `Imported video: ${cleanName}`,
      category: 'other',
      tags: ['imported', 'video']
    };
  }

  /**
   * Clean up temporary files
   */
  private cleanup(filePaths: string[]) {
    filePaths.forEach(filePath => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Cleaned up: ${filePath}`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not clean up: ${filePath}`);
      }
    });
  }

  /**
   * Main method to analyze video and generate metadata
   */
  public async analyzeVideo(
    videoPath: string,
    options: AnalysisOptions = {}
  ): Promise<VideoMetadata> {
    const {
      includeTranscript = false,
      maxDurationForAnalysis = 300, // 5 minutes
      language = 'en'
    } = options;

    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`);
    }

    const originalFilename = path.basename(videoPath);
    console.log(`🎬 Starting video analysis for: ${originalFilename}`);

    // If OpenAI is not available, return fallback metadata
    if (!this.openai) {
      console.warn('OpenAI not available, using fallback metadata');
      return {
        ...this.generateFallbackMetadata(originalFilename),
        transcript: undefined
      };
    }

    const tempFiles: string[] = [];
    
    try {
      // Extract audio
      const audioPath = await this.extractAudio(videoPath, maxDurationForAnalysis);
      tempFiles.push(audioPath);

      // Transcribe audio
      const transcript = await this.transcribeAudio(audioPath, language);
      
      if (!transcript || transcript.trim().length === 0) {
        console.warn('No transcript generated, using fallback metadata');
        return {
          ...this.generateFallbackMetadata(originalFilename),
          transcript: undefined
        };
      }

      // Generate metadata from transcript
      const metadata = await this.generateMetadataFromTranscript(transcript, originalFilename);
      
      const result: VideoMetadata = {
        ...metadata,
        transcript: includeTranscript ? transcript : undefined
      };

      console.log('🎉 Video analysis completed successfully');
      return result;

    } catch (error) {
      console.error('Video analysis failed:', error);
      console.log('Falling back to basic metadata generation');
      
      return {
        ...this.generateFallbackMetadata(originalFilename),
        transcript: undefined
      };
    } finally {
      // Clean up temporary files
      this.cleanup(tempFiles);
    }
  }

  /**
   * Analyze video from buffer (for API uploads)
   */
  public async analyzeVideoFromBuffer(
    videoBuffer: Buffer,
    originalFilename: string,
    options: AnalysisOptions = {}
  ): Promise<VideoMetadata> {
    const tempVideoPath = path.join(this.tempDir, `temp_${uuidv4()}.mp4`);
    
    try {
      // Write buffer to temporary file
      fs.writeFileSync(tempVideoPath, videoBuffer);
      
      // Analyze the temporary file
      const result = await this.analyzeVideo(tempVideoPath, options);
      
      return result;
    } finally {
      // Clean up temporary video file
      this.cleanup([tempVideoPath]);
    }
  }
}

export default VideoAnalysisService;
export type { VideoMetadata, AnalysisOptions }; 