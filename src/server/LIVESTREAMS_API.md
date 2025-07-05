# Livestreams API Documentation

## Overview

The Livestreams API provides endpoints for managing livestreams on the livestakes.fun platform. Each livestream is associated with a creator wallet address and can have different statuses (scheduled, active, ended).

## Base URL
```
http://localhost:3334/api
```

## Livestream Schema

```typescript
interface Livestream {
  id?: number;
  title: string;
  description?: string;
  creator_wallet_address: string;
  stream_url?: string;
  thumbnail_url?: string;
  status: 'scheduled' | 'active' | 'ended';
  start_time?: Date;
  end_time?: Date;
  view_count?: number;
  category?: string;
  created_at?: Date;
  updated_at?: Date;
}
```

## Endpoints

### 1. Get All Livestreams
**GET** `/api/livestreams`

Get a list of all livestreams with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status (`scheduled`, `active`, `ended`)
- `creator_wallet_address` (optional): Filter by creator wallet address
- `limit` (optional): Limit number of results
- `offset` (optional): Pagination offset

**Example Request:**
```bash
curl "http://localhost:3334/api/livestreams?status=active&limit=10"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Epic Gaming Session",
      "description": "Live gaming with AI betting opportunities",
      "creator_wallet_address": "0x1234567890123456789012345678901234567890",
      "stream_url": "https://twitch.tv/example",
      "thumbnail_url": "https://example.com/thumb.jpg",
      "status": "active",
      "start_time": "2024-12-19T20:00:00Z",
      "end_time": null,
      "view_count": 156,
      "category": "gaming",
      "created_at": "2024-12-19T19:45:00Z",
      "updated_at": "2024-12-19T20:30:00Z"
    }
  ],
  "count": 1
}
```

### 2. Get Livestream by ID
**GET** `/api/livestreams/:id`

Get a specific livestream by its ID.

**Example Request:**
```bash
curl "http://localhost:3334/api/livestreams/1"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Epic Gaming Session",
    "description": "Live gaming with AI betting opportunities",
    "creator_wallet_address": "0x1234567890123456789012345678901234567890",
    "stream_url": "https://twitch.tv/example",
    "thumbnail_url": "https://example.com/thumb.jpg",
    "status": "active",
    "start_time": "2024-12-19T20:00:00Z",
    "end_time": null,
    "view_count": 156,
    "category": "gaming",
    "created_at": "2024-12-19T19:45:00Z",
    "updated_at": "2024-12-19T20:30:00Z"
  }
}
```

### 3. Create Livestream
**POST** `/api/livestreams`

Create a new livestream.

**Request Body:**
```json
{
  "title": "My New Stream",
  "description": "An exciting new stream",
  "creator_wallet_address": "0x1234567890123456789012345678901234567890",
  "stream_url": "https://twitch.tv/mystream",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "status": "scheduled",
  "start_time": "2024-12-20T18:00:00Z",
  "category": "gaming"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3334/api/livestreams" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Stream",
    "description": "An exciting new stream",
    "creator_wallet_address": "0x1234567890123456789012345678901234567890",
    "stream_url": "https://twitch.tv/mystream",
    "status": "scheduled",
    "start_time": "2024-12-20T18:00:00Z",
    "category": "gaming"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "My New Stream",
    "description": "An exciting new stream",
    "creator_wallet_address": "0x1234567890123456789012345678901234567890",
    "stream_url": "https://twitch.tv/mystream",
    "thumbnail_url": null,
    "status": "scheduled",
    "start_time": "2024-12-20T18:00:00Z",
    "end_time": null,
    "view_count": 0,
    "category": "gaming",
    "created_at": "2024-12-19T21:00:00Z",
    "updated_at": "2024-12-19T21:00:00Z"
  },
  "message": "Livestream created successfully"
}
```

### 4. Update Livestream
**PUT** `/api/livestreams/:id`

Update an existing livestream.

**Request Body:** (any combination of updateable fields)
```json
{
  "status": "active",
  "start_time": "2024-12-19T20:30:00Z",
  "view_count": 25
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3334/api/livestreams/2" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "start_time": "2024-12-19T20:30:00Z"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "My New Stream",
    "description": "An exciting new stream",
    "creator_wallet_address": "0x1234567890123456789012345678901234567890",
    "stream_url": "https://twitch.tv/mystream",
    "thumbnail_url": null,
    "status": "active",
    "start_time": "2024-12-19T20:30:00Z",
    "end_time": null,
    "view_count": 0,
    "category": "gaming",
    "created_at": "2024-12-19T21:00:00Z",
    "updated_at": "2024-12-19T21:05:00Z"
  },
  "message": "Livestream updated successfully"
}
```

### 5. Delete Livestream
**DELETE** `/api/livestreams/:id`

Delete a livestream by ID.

**Example Request:**
```bash
curl -X DELETE "http://localhost:3334/api/livestreams/2"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Livestream deleted successfully"
}
```

### 6. Get Livestreams by Creator
**GET** `/api/livestreams/creator/:wallet_address`

Get all livestreams created by a specific wallet address.

**Example Request:**
```bash
curl "http://localhost:3334/api/livestreams/creator/0x1234567890123456789012345678901234567890"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Epic Gaming Session",
      "description": "Live gaming with AI betting opportunities",
      "creator_wallet_address": "0x1234567890123456789012345678901234567890",
      "stream_url": "https://twitch.tv/example",
      "thumbnail_url": "https://example.com/thumb.jpg",
      "status": "active",
      "start_time": "2024-12-19T20:00:00Z",
      "end_time": null,
      "view_count": 156,
      "category": "gaming",
      "created_at": "2024-12-19T19:45:00Z",
      "updated_at": "2024-12-19T20:30:00Z"
    }
  ],
  "count": 1
}
```

### 7. Increment View Count
**POST** `/api/livestreams/:id/view`

Increment the view count for a livestream by 1.

**Example Request:**
```bash
curl -X POST "http://localhost:3334/api/livestreams/1/view"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Epic Gaming Session",
    "description": "Live gaming with AI betting opportunities",
    "creator_wallet_address": "0x1234567890123456789012345678901234567890",
    "stream_url": "https://twitch.tv/example",
    "thumbnail_url": "https://example.com/thumb.jpg",
    "status": "active",
    "start_time": "2024-12-19T20:00:00Z",
    "end_time": null,
    "view_count": 157,
    "category": "gaming",
    "created_at": "2024-12-19T19:45:00Z",
    "updated_at": "2024-12-19T20:35:00Z"
  },
  "message": "View count updated successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Usage Examples

### Create a gaming livestream
```javascript
const response = await fetch('http://localhost:3334/api/livestreams', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Epic Fortnite Battle Royale',
    description: 'Watch me dominate in Fortnite with live betting opportunities!',
    creator_wallet_address: '0x1234567890123456789012345678901234567890',
    stream_url: 'https://twitch.tv/mystream',
    thumbnail_url: 'https://example.com/fortnite-thumb.jpg',
    status: 'scheduled',
    start_time: '2024-12-20T19:00:00Z',
    category: 'gaming'
  })
});

const data = await response.json();
console.log('Created livestream:', data.data);
```

### Start a livestream (update status to active)
```javascript
const response = await fetch('http://localhost:3334/api/livestreams/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'active',
    start_time: new Date().toISOString()
  })
});

const data = await response.json();
console.log('Stream started:', data.data);
```

### End a livestream
```javascript
const response = await fetch('http://localhost:3334/api/livestreams/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'ended',
    end_time: new Date().toISOString()
  })
});

const data = await response.json();
console.log('Stream ended:', data.data);
```

## Database Schema

The `livestreams` table includes the following indexes for optimal performance:
- Primary key on `id`
- Index on `creator_wallet_address` for creator queries
- Index on `status` for filtering
- Index on `start_time DESC` for chronological sorting

This ensures fast queries when filtering by creator, status, or when ordering by start time. 