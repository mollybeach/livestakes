# Video Import Setup Guide

This guide explains how to set up and use the video import functionality for uploading MP4 and MOV files to Google Cloud Platform and creating livestream entries. MOV files are automatically converted to MP4 format.

## Prerequisites

### System Requirements

For MOV to MP4 conversion, you need ffmpeg installed on your system:

- **macOS**: `brew install ffmpeg`
- **Ubuntu/Debian**: `sudo apt install ffmpeg`
- **Windows**: Download from https://ffmpeg.org/

### NPM Dependencies

Install the required dependencies:

```bash
cd src/server
npm install fluent-ffmpeg
npm install -D @types/fluent-ffmpeg
```

## Environment Variables

Create a `.env` file in the `src/server` directory with the following variables:

```bash
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=livestakes
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Server Configuration
PORT=3334
NODE_ENV=development
PUBLIC_API_URL=http://localhost:3334

# Google Cloud Platform Configuration (required for video uploads)
GCP_PROJECT_ID=your-gcp-project-id
GCP_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GCP_BUCKET_NAME=livestakes-videos

# OpenAI Configuration (required for AI-powered video analysis)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: For production deployments
# PUBLIC_API_URL=https://your-production-domain.com
```

## GCP Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Cloud Storage API**
   - Navigate to APIs & Services > Library
   - Search for "Cloud Storage API" and enable it

3. **Create a Service Account**
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name like "livestakes-video-uploader"
   - Grant "Storage Admin" role
   - Create and download the JSON key file

4. **Extract Credentials**
   - Open the downloaded JSON file
   - Copy the `project_id` to `GCP_PROJECT_ID`
   - Copy the `client_email` to `GCP_CLIENT_EMAIL`
   - Copy the `private_key` to `GCP_PRIVATE_KEY` (keep the \n characters)

## Usage

### 1. API Endpoint for Single Video Upload

**POST** `/api/upload-video`

```bash
curl -X POST http://localhost:3334/api/upload-video \
  -F "video=@/path/to/video.mp4" \
  -F "title=Epic Gaming Session" \
  -F "description=Amazing gameplay with betting opportunities" \
  -F "creator_wallet_address=0x1234567890123456789012345678901234567890" \
  -F "category=gaming" \
  -F "thumbnail_url=https://example.com/thumbnail.jpg"

# Or with MOV file (automatically converted to MP4)
curl -X POST http://localhost:3334/api/upload-video \
  -F "video=@/path/to/video.mov" \
  -F "title=Epic Gaming Session" \
  -F "description=Amazing gameplay with betting opportunities" \
  -F "creator_wallet_address=0x1234567890123456789012345678901234567890" \
  -F "category=gaming" \
  -F "thumbnail_url=https://example.com/thumbnail.jpg"

# With AI analysis enabled (auto-generates title, description, category)
curl -X POST http://localhost:3334/api/upload-video \
  -F "video=@/path/to/video.mp4" \
  -F "creator_wallet_address=0x1234567890123456789012345678901234567890" \
  -F "use_ai_analysis=true" \
  -F "max_analysis_duration=180" \
  -F "include_transcript=true"
```

### 2. Bulk Import from Directory

Import all MP4 and MOV files from a directory:

```bash
npm run import-videos ./videos 0x1234567890123456789012345678901234567890 gaming
```

**Parameters:**
- `./videos` - Directory containing MP4 and MOV files
- `0x123...` - Creator wallet address
- `gaming` - Optional category
- Fourth parameter - Optional default thumbnail URL

**Note**: MOV files are automatically converted to MP4 during import.

### 3. Single Video Import

Import a single video file:

```bash
npm run import-video ./video.mp4 "Epic Gaming Session" 0x1234567890123456789012345678901234567890 "Amazing gameplay" gaming "https://example.com/thumb.jpg"

# Or with MOV file
npm run import-video ./video.mov "Epic Gaming Session" 0x1234567890123456789012345678901234567890 "Amazing gameplay" gaming "https://example.com/thumb.jpg"
```

**Parameters:**
- `./video.mp4` or `./video.mov` - Path to video file
- `"Epic Gaming Session"` - Video title
- `0x123...` - Creator wallet address
- `"Amazing gameplay"` - Optional description
- `gaming` - Optional category
- `"https://..."` - Optional thumbnail URL

## Development Mode

If GCP credentials are not configured, the system will:
- Store videos locally in `src/server/temp/videos/`
- Create placeholder URLs pointing to local API endpoints
- Still create database entries for testing

## Video File Requirements

- **Format**: MP4 only
- **Size Limit**: 500MB (configurable in code)
- **Naming**: Files will be renamed with unique identifiers for storage

## Database Integration

The import process automatically:
- Creates entries in the `livestreams` table
- Sets status to 'ended' (as imported videos are past streams)
- Stores the GCP public URL in `stream_url` field
- Generates metadata from filename or provided parameters

## Troubleshooting

### Common Issues:

1. **GCP Upload Errors**
   - Check credentials are correctly set
   - Verify Storage API is enabled
   - Ensure service account has Storage Admin role

2. **Local Development**
   - Videos stored in `temp/videos/` directory
   - Accessible via `/api/videos/:filename` endpoint
   - Supports range requests for video streaming

3. **Database Errors**
   - Ensure database is running and migrated
   - Check wallet address format (should start with 0x)
   - Verify required fields are provided

### Example Error Messages:

- `GCP Storage not initialized` - Missing GCP credentials
- `Bucket creation failed` - Insufficient GCP permissions
- `File must be an MP4 video` - Wrong file format
- `Directory does not exist` - Invalid path provided

## Bucket Management

The system includes a comprehensive bucket cleaning tool to manage storage costs and remove unused files.

### Bucket Statistics

View detailed bucket information:

```bash
npm run clean-bucket stats
```

**Output includes:**
- Total files and size
- Number of video files
- Orphaned files (not referenced in database)
- Files older than 30 days
- Average and largest file sizes

### List Files

List files with optional filters:

```bash
# List all files
npm run clean-bucket list

# List orphaned files only
npm run clean-bucket list --delete-orphaned

# List files older than 30 days
npm run clean-bucket list --older-than-days=30

# List large files (>100MB)
npm run clean-bucket list --size-threshold-mb=100

# List files matching pattern
npm run clean-bucket list --pattern="gaming"
```

### Clean Bucket

Delete files based on various criteria:

```bash
# Dry run: show what would be deleted
npm run clean-bucket clean --older-than-days=30 --dry-run

# Delete orphaned files with confirmation
npm run clean-bucket clean --delete-orphaned --interactive

# Delete old large files
npm run clean-bucket clean --older-than-days=7 --size-threshold-mb=100 --interactive

# Delete first 10 old files
npm run clean-bucket clean --older-than-days=14 --max-files=10 --dry-run
```

**Cleanup Options:**
- `--dry-run` - Preview deletions without actually deleting
- `--older-than-days=N` - Only files older than N days  
- `--pattern="regex"` - Files matching regex pattern
- `--max-files=N` - Limit to first N files
- `--size-threshold-mb=N` - Only files larger than N MB
- `--delete-orphaned` - Only orphaned files (not in database)
- `--interactive` - Ask for confirmation before deletion

**Safety Features:**
- Dry run mode to preview changes
- Interactive confirmation prompts
- Database cross-reference to avoid deleting referenced files
- Detailed logging of all operations

## Production Deployment

For production:
1. Set `NODE_ENV=production`
2. Configure proper `PUBLIC_API_URL`
3. Use secure GCP credentials management
4. Consider video processing pipelines for optimization
5. Set up CDN for better video delivery

## API Response Format

Successful upload response:
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "videoUrl": "https://storage.googleapis.com/bucket/videos/filename.mp4",
  "livestream": {
    "id": 123,
    "title": "Epic Gaming Session",
    "creator_wallet_address": "0x123...",
    "stream_url": "https://storage.googleapis.com/...",
    "status": "ended",
    // ... other fields
  }
}
``` 