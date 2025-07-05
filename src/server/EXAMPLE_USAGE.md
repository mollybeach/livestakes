# Video Import - Quick Usage Examples

## Setup

1. Install dependencies:
```bash
cd src/server
npm install
```

2. Create `.env` file with your configuration (see VIDEO_IMPORT_SETUP.md for details)

3. Start the database and run migrations:
```bash
npm run migrate
```

## Example Usage

### 1. Start the Server
```bash
npm run dev
```

### 2. Test API Upload (using curl)

Create a test video or use an existing MP4 file:

```bash
# Upload a single video via API
curl -X POST http://localhost:3334/api/upload-video \
  -F "video=@./test-video.mp4" \
  -F "title=Epic Fortnite Battle Royale" \
  -F "description=Watch me get Victory Royale with live betting!" \
  -F "creator_wallet_address=0x1234567890123456789012345678901234567890" \
  -F "category=gaming" \
  -F "thumbnail_url=https://via.placeholder.com/400x225/6366f1/ffffff?text=Fortnite"
```

### 3. Bulk Import from Directory

If you have a folder with MP4 files:

```bash
# Create test directory structure
mkdir -p ./test-videos
# Add some MP4 files to ./test-videos/

# Import all videos from directory
npm run import-videos ./test-videos 0x1234567890123456789012345678901234567890 gaming
```

### 4. Import Single Video via Script

```bash
npm run import-video ./my-video.mp4 "My Awesome Stream" 0x1234567890123456789012345678901234567890 "This was an epic gaming session" gaming
```

## Sample Response

After successful upload, you'll get:

```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "videoUrl": "https://storage.googleapis.com/livestakes-videos/videos/video_12345678_1703000000000_uuid.mp4",
  "livestream": {
    "id": 1,
    "title": "Epic Fortnite Battle Royale",
    "description": "Watch me get Victory Royale with live betting!",
    "creator_wallet_address": "0x1234567890123456789012345678901234567890",
    "stream_url": "https://storage.googleapis.com/livestakes-videos/videos/video_12345678_1703000000000_uuid.mp4",
    "thumbnail_url": "https://via.placeholder.com/400x225/6366f1/ffffff?text=Fortnite",
    "status": "ended",
    "category": "gaming",
    "view_count": 0,
    "created_at": "2024-12-19T...",
    "updated_at": "2024-12-19T..."
  }
}
```

## Test Frontend Integration

After importing videos, test the frontend:

```bash
cd ../.. # Go back to project root
cd src
npm run dev # Start Next.js frontend
```

Visit `http://localhost:3000` to see your imported videos in the "Explore All" section!

## Development Mode (No GCP)

If you don't have GCP credentials set up, the system will:
- Store videos locally in `src/server/temp/videos/`
- Create database entries with local URLs
- Still work for testing the frontend

The videos will be accessible at: `http://localhost:3334/api/videos/filename.mp4`

## Common Test Commands

```bash
# Check if server is running
curl http://localhost:3334/api/health

# Get all livestreams via API
curl http://localhost:3334/api/livestreams

# Get only ended streams (imported videos)
curl "http://localhost:3334/api/livestreams?status=ended"

# Get streams by creator
curl http://localhost:3334/api/livestreams/creator/0x1234567890123456789012345678901234567890
``` 