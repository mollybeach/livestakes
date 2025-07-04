# livestakes Game Backend Server

This server implements a provably fair livestakes game with proper casino mathematics to ensure the house edge is maintained over time.

## Features

- Implements a mathematically sound livestakes game with a 3.5% house edge
- Uses cryptographic techniques to ensure game fairness and verifiability
- Provides multiplier distribution based on binomial probability with adjustments
- Supports real-time game updates via WebSockets
- Offers deterministic path generation for animated ball drops
- Includes comprehensive tests to validate the probability model

## Technology Stack

- Node.js with TypeScript
- Express.js for the API
- Socket.io for real-time communication
- Seedrandom for deterministic random number generation
- Jest for testing

## Getting Started

### Prerequisites

- Node.js v16+ and npm

### Installation

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the server:
   ```
   npm run build
   ```

### Running the Server

Start the development server with hot reloading:
```
npm run dev
```

Or start the production server:
```
npm run start
```

The server will run on port 3334 by default (configurable via PORT environment variable).

## API Endpoints

- `GET /api/health` - Check server status
- `POST /api/livestakes/path` - Generate a livestakes path with a predetermined outcome

## WebSocket Events

### Client to Server
- `play_livestakes` - Initiate a game with bet amount and optional seed

### Server to Client
- `livestakes_result` - Result of a game including path, multiplier, and payout
- `livestakes_error` - Error information if the game fails

## Casino Mathematics

The livestakes game implements a target house edge of 3.5%, which is a fair value for this type of game. This is achieved by:

1. Calculating the theoretical binomial distribution for each bucket
2. Adjusting the probabilities to achieve the desired house edge
3. Applying stronger adjustments to high-multiplier outcomes
4. Normalizing probabilities to ensure they sum to 1
5. Converting probabilities to ranges for random number generator targeting

The expected value (return-to-player) is approximately 96.5%, meaning that over a large number of games, players should expect to get back 96.5% of their total bets.

## Testing

Run the tests with:
```
npm test
```

The tests validate:
- Game result structure
- Deterministic outcomes with the same seeds
- Path generation algorithms
- Expected value calculations
- Bucket probability distributions 