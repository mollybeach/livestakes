import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Log database configuration (without sensitive data)
console.log('Database configuration:', {
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'livestakes',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Database connection configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'livestakes',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  max: 20, // Maximum number of clients
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 10000, // Increased from 2000ms to 10000ms for slower connections
});

// Add function to log pool status
const logPoolStatus = () => {
  console.log('Pool status:', {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  });
};

// Set interval to log pool status periodically
const poolStatusInterval = setInterval(logPoolStatus, 60000); // Log every minute

// Test the database connection
pool.on('connect', (client) => {
  console.log(`Connected to PostgreSQL database (client ID: ${(client as any).processID || 'unknown'})`);
  logPoolStatus();
});

pool.on('error', (err: any, client: any) => {
  console.error(`Unexpected error on PostgreSQL client ${client?.processID || 'unknown'}:`, err);
  logPoolStatus();
});

pool.on('acquire', (client: any) => {
  console.log(`Client acquired from pool (ID: ${client.processID || 'unknown'})`);
  logPoolStatus();
});

pool.on('remove', (client: any) => {
  console.log(`Client removed from pool (ID: ${client.processID || 'unknown'})`);
  logPoolStatus();
});

// Clean up on application exit
process.on('SIGINT', () => {
  clearInterval(poolStatusInterval);
  console.log('Closing database pool');
  pool.end().then(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

export default pool; 