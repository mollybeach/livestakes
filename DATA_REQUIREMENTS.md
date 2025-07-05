# LiveStakes Data Requirements & Structure

## Overview

This document outlines all data requirements, structures, and existing data sources for the LiveStakes platform. The project combines livestreaming, prediction markets, and AI-powered betting opportunities.

## Database Schema

### Current Database Structure

The project uses PostgreSQL with the following main tables:

#### 1. `livestreams` Table
```sql
CREATE TABLE livestreams (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    creator_wallet_address TEXT NOT NULL,
    stream_url TEXT,
    thumbnail_url TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' 
        CHECK (status IN ('scheduled', 'active', 'ended')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    category TEXT,
    tags JSONB DEFAULT '[]',
    transcript TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    market_ids JSONB DEFAULT '[]'
);
```

**Indexes:**
- `idx_livestreams_creator` on `creator_wallet_address`
- `idx_livestreams_status` on `status`
- `idx_livestreams_start_time` on `start_time DESC`
- `idx_livestreams_tags` on `tags` (GIN)
- `idx_livestreams_market_ids` on `market_ids` (GIN)

#### 2. `market_metadata` Table
```sql
CREATE TABLE market_metadata (
    id SERIAL PRIMARY KEY,
    contract_address TEXT NOT NULL UNIQUE,
    creator_wallet_address TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_market_metadata_creator` on `creator_wallet_address`
- `idx_market_metadata_category` on `category`
- `idx_market_metadata_tags` on `tags` (GIN)

#### 3. `migrations` Table
```sql
CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Data Types & Interfaces

### Frontend Data Structures

#### 1. Livestream Interface (`src/app/data/livestreams.ts`)
```typescript
export interface stream {
  id: string;
  title: string;
  team: string;
  odds: string;
  thumbnail: string;
  avatar: string;
  mcap: string;
  ath: string;
  viewers?: number;
  isLive?: boolean;
  totalBets?: number;
  totalVolume?: string;
  category?: string;
  description?: string;
  username: string;
}
```

#### 2. Market Interface (`src/app/data/markets.ts`)
```typescript
export interface Market {
  id: string;
  title: string;
  team: string;
  odds: string;
  thumbnail: string;
  avatar: string;
  mcap: string;
  ath: string;
  viewers?: number;
  isLive?: boolean;
  totalBets?: number;
  totalVolume?: string;
  category?: string;
  description?: string;
  username: string;
}
```

#### 3. API Livestream Interface (`src/app/lib/livestreamsApi.ts`)
```typescript
export interface Livestream {
  id?: number;
  title: string;
  description?: string;
  creator_wallet_address: string;
  stream_url?: string;
  thumbnail_url?: string;
  status: 'scheduled' | 'active' | 'ended';
  start_time?: string;
  end_time?: string;
  view_count?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}
```

#### 4. Market Creation Interface (`src/app/components/MarketCreationModal.tsx`)
```typescript
interface MarketFormData {
  question: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  expiryDays: number;
}
```

#### 5. Blockchain Market Interface (`src/app/lib/contractsApi.ts`)
```typescript
export interface MarketInfo {
  livestreamId: number;
  question: string;
  livestreamTitle: string;
  state: MarketState;
  outcome: BetSide;
  yesBets: string;
  noBets: string;
  totalPool: string;
  totalBettors: number;
  createdAt: number;
  closedAt: number;
  resolvedAt: number;
}
```

### Backend Data Structures

#### 1. Server Livestream Interface (`src/server/src/database/transactions.ts`)
```typescript
export interface Livestream {
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
  tags?: string[];
  transcript?: string;
  created_at?: Date;
  updated_at?: Date;
}
```

#### 2. Video Analysis Interface (`src/server/src/services/videoAnalysis.ts`)
```typescript
interface VideoMetadata {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  transcript?: string;
}
```

## Sample Data Sources

### 1. Frontend Sample Data

#### Livestreams Sample Data (`src/app/data/livestreams.ts`)
- **50 sample livestreams** with diverse categories
- Categories: DeFi, Gaming, AI, NFT, Crypto, Metaverse, Sports, eSports, Music, Media, etc.
- Each entry includes: title, team, odds, thumbnail, avatar, market cap, ATH, viewers, betting data
- **Can be used for:** UI development, testing, demo purposes

#### Markets Sample Data (`src/app/data/markets.ts`)
- **6 sample markets** with prediction market data
- Includes: market questions, odds, betting volumes, participant counts
- **Can be used for:** Market creation testing, UI development

#### API Sample Data (`src/app/lib/livestreamsApi.ts`)
- **6 sample livestreams** with API-compatible structure
- Includes: stream URLs, status, timestamps, categories
- **Can be used for:** API testing, frontend development

### 2. Backend Sample Data

#### Database Sample Data
- **11 real livestreams** in the database (from `dump-livestakes.sql`)
- Includes: ETH Global hackathon projects with transcripts
- Real video URLs and metadata
- **Can be used for:** Production data, real examples

#### Video Analysis Sample Data (`src/server/src/scripts/importVideos.ts`)
- Video import configuration and metadata structures
- AI analysis results and transcript generation
- **Can be used for:** Video processing pipeline testing

## Data Requirements by Feature

### 1. Livestream Management

**Required Data:**
- Stream metadata (title, description, category)
- Creator wallet addresses
- Stream URLs (WebRTC, RTMP, HLS)
- Thumbnail images
- Status tracking (scheduled/active/ended)
- View counts and engagement metrics
- Tags for categorization
- AI-generated transcripts

**Existing Sources:**
- ✅ Frontend sample data (50 entries)
- ✅ Backend API sample data (6 entries)
- ✅ Database real data (11 entries)
- ✅ Video import scripts

### 2. Prediction Markets

**Required Data:**
- Market questions and outcomes
- Betting odds and pools
- Participant counts and volumes
- Market states (open/closed/resolved)
- Creator wallet addresses
- Market categories and tags
- Expiry dates and resolution logic

**Existing Sources:**
- ✅ Frontend sample markets (6 entries)
- ✅ Market creation modal interface
- ✅ Blockchain market interfaces
- ✅ Database market_metadata table

### 3. User Authentication & Wallets

**Required Data:**
- User wallet addresses
- Authentication states
- Wallet connection status
- User preferences and settings

**Existing Sources:**
- ✅ Privy integration
- ✅ Dynamic Labs SDK
- ✅ Wallet connection interfaces

### 4. Real-time Features

**Required Data:**
- WebSocket connection states
- Real-time betting updates
- Live stream status changes
- Market price movements
- Chat messages and interactions

**Existing Sources:**
- ✅ Socket.io implementation
- ✅ Real-time data structures
- ✅ WebSocket event handlers

### 5. AI & Analytics

**Required Data:**
- Video transcripts and analysis
- Voice recognition data
- Market prediction algorithms
- User behavior analytics
- Performance metrics

**Existing Sources:**
- ✅ OpenAI integration
- ✅ Video analysis services
- ✅ Transcript generation
- ✅ AI decision engine interfaces

## Data Integration Points

### 1. Frontend ↔ Backend
- **API endpoints** for livestream CRUD operations
- **WebSocket connections** for real-time updates
- **File upload** for video and thumbnail management

### 2. Backend ↔ Database
- **PostgreSQL** for persistent data storage
- **Migrations** for schema management
- **Connection pooling** for performance

### 3. Backend ↔ Blockchain
- **Smart contract interactions** for market creation
- **Wallet integration** for user authentication
- **Transaction monitoring** for bet placement

### 4. Backend ↔ AI Services
- **OpenAI API** for video analysis
- **Transcript generation** for content processing
- **Market prediction** algorithms

## Data Quality & Validation

### Required Validations

#### 1. Livestream Data
- Title: 5-100 characters
- Description: 10-500 characters
- Wallet address: Valid Ethereum address format
- Status: Must be one of ['scheduled', 'active', 'ended']
- Category: Must be predefined list
- Tags: Array of strings, max 10 tags

#### 2. Market Data
- Question: 10-200 characters
- Title: 5-100 characters
- Expiry: 1-365 days
- Category: Must be predefined list
- Tags: Array of strings, max 10 tags

#### 3. User Data
- Wallet address: Valid format
- Authentication: Required for market creation
- Permissions: Role-based access control

## Data Sources & Recommendations

### 1. For Development & Testing
**Use:** Frontend sample data (`src/app/data/livestreams.ts`)
- 50 diverse entries
- Covers all categories
- Includes betting metrics
- Perfect for UI development

### 2. For API Testing
**Use:** API sample data (`src/app/lib/livestreamsApi.ts`)
- 6 API-compatible entries
- Realistic timestamps and URLs
- Good for integration testing

### 3. For Production Demo
**Use:** Database real data (from `dump-livestakes.sql`)
- 11 real ETH Global projects
- Actual video URLs and transcripts
- Real market metadata

### 4. For Video Processing
**Use:** Video import scripts (`src/server/src/scripts/importVideos.ts`)
- Video analysis pipeline
- AI transcript generation
- Thumbnail creation

## Data Migration & Setup

### 1. Database Setup
```bash
# Start PostgreSQL container
docker-compose up -d livestakesmdb

# Import existing data
psql -h localhost -p 5492 -U root -d livestakes -f dump-livestakes.sql
```

### 2. Sample Data Population
```bash
# Frontend development
# Use src/app/data/livestreams.ts (50 entries)

# API testing
# Use src/app/lib/livestreamsApi.ts (6 entries)

# Production demo
# Use database real data (11 entries)
```

### 3. Video Processing Setup
```bash
# Configure video import
cd src/server
npm run import-videos -- --input ./videos --creator 0x1234...
```

## Recommendations

### 1. Data Consistency
- **Standardize interfaces** between frontend and backend
- **Use TypeScript** for type safety across all data structures
- **Implement validation** at API boundaries

### 2. Performance Optimization
- **Index database** on frequently queried fields
- **Cache popular data** in Redis for faster access
- **Paginate large datasets** to prevent memory issues

### 3. Data Security
- **Validate wallet addresses** before database operations
- **Sanitize user inputs** to prevent injection attacks
- **Encrypt sensitive data** in transit and at rest

### 4. Scalability
- **Design for horizontal scaling** of database and API
- **Use connection pooling** for database efficiency
- **Implement caching strategies** for frequently accessed data

## Conclusion

The LiveStakes project has comprehensive data structures and sample data across all major features. The existing data sources provide excellent coverage for development, testing, and production deployment. The database schema is well-designed with proper indexing and the interfaces are consistent across frontend and backend components.

**Key Strengths:**
- ✅ Comprehensive sample data (50+ entries)
- ✅ Well-structured database schema
- ✅ Consistent TypeScript interfaces
- ✅ Real production data available
- ✅ AI integration ready

**Next Steps:**
1. Use existing sample data for development
2. Import real data for production demos
3. Implement data validation and security measures
4. Set up monitoring and analytics for data quality 