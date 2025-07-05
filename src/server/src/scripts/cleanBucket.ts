#!/usr/bin/env node

import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';
import pool from '../database/db';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

interface CleanupOptions {
  dryRun?: boolean;
  olderThanDays?: number;
  pattern?: string;
  maxFiles?: number;
  sizeThresholdMB?: number;
  deleteOrphaned?: boolean; // Delete files not referenced in database
  interactive?: boolean;
}

class BucketCleaner {
  private storageClient: Storage | null = null;
  private bucketName: string = process.env.GCP_BUCKET_NAME || 'livestakes-videos';

  constructor() {
    this.initializeStorage();
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
        console.log('✅ Google Cloud Storage client initialized');
      } else {
        throw new Error('GCP credentials not found');
      }
    } catch (error) {
      console.error('❌ Error initializing GCP Storage:', error);
      throw error;
    }
  }

  /**
   * Get all files from the bucket with metadata
   */
  private async getAllFiles(): Promise<any[]> {
    if (!this.storageClient) {
      throw new Error('Storage client not initialized');
    }

    console.log(`📁 Fetching files from bucket: ${this.bucketName}`);
    
    const [files] = await this.storageClient.bucket(this.bucketName).getFiles();
    
    const fileData = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        return {
          name: file.name,
          size: parseInt(String(metadata.size) || '0'),
          created: new Date(metadata.timeCreated || ''),
          updated: new Date(metadata.updated || ''),
          contentType: metadata.contentType,
          metadata: metadata.metadata || {}
        };
      })
    );

    return fileData.sort((a, b) => b.created.getTime() - a.created.getTime());
  }

  /**
   * Get URLs referenced in the database
   */
  private async getReferencedUrls(): Promise<Set<string>> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT stream_url FROM livestreams WHERE stream_url IS NOT NULL'
      );
      
      const referencedUrls = new Set<string>();
      
      result.rows.forEach(row => {
        if (row.stream_url) {
          // Extract filename from URL
          const url = row.stream_url;
          if (url.includes(`storage.googleapis.com/${this.bucketName}/`)) {
            const filename = url.split('/').pop();
            if (filename) {
              referencedUrls.add(filename);
            }
          }
        }
      });
      
      return referencedUrls;
    } finally {
      client.release();
    }
  }

  /**
   * Format file size in human readable format
   */
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Show bucket statistics
   */
  public async showStats(): Promise<void> {
    console.log('\n📊 Bucket Statistics\n' + '='.repeat(50));
    
    const files = await this.getAllFiles();
    const referencedUrls = await getReferencedUrls();
    
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const videoFiles = files.filter(f => f.name.startsWith('videos/'));
    const orphanedFiles = files.filter(f => !referencedUrls.has(f.name.split('/').pop() || ''));
    
    const now = new Date();
    const oldFiles = files.filter(f => {
      const daysDiff = (now.getTime() - f.created.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff > 30;
    });
    
    console.log(`📁 Total files: ${files.length}`);
    console.log(`📹 Video files: ${videoFiles.length}`);
    console.log(`💾 Total size: ${this.formatFileSize(totalSize)}`);
    console.log(`🗑️  Orphaned files: ${orphanedFiles.length}`);
    console.log(`⏰ Files older than 30 days: ${oldFiles.length}`);
    console.log(`🔗 Referenced in database: ${referencedUrls.size}`);
    
    if (files.length > 0) {
      const avgSize = totalSize / files.length;
      const largest = files.reduce((max, file) => file.size > max.size ? file : max);
      
      console.log(`📏 Average file size: ${this.formatFileSize(avgSize)}`);
      console.log(`📈 Largest file: ${largest.name} (${this.formatFileSize(largest.size)})`);
    }
    
    console.log('');
  }

  /**
   * List files with details
   */
  public async listFiles(options: CleanupOptions = {}): Promise<void> {
    const files = await this.getAllFiles();
    const referencedUrls = await getReferencedUrls();
    
    console.log('\n📋 File Listing\n' + '='.repeat(80));
    console.log('Name'.padEnd(40), 'Size'.padEnd(12), 'Created'.padEnd(12), 'Referenced');
    console.log('-'.repeat(80));
    
    let filteredFiles = files;
    
    // Apply filters
    if (options.olderThanDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - options.olderThanDays);
      filteredFiles = filteredFiles.filter(f => f.created < cutoffDate);
    }
    
    if (options.pattern) {
      const regex = new RegExp(options.pattern, 'i');
      filteredFiles = filteredFiles.filter(f => regex.test(f.name));
    }
    
    if (options.sizeThresholdMB) {
      const sizeThreshold = options.sizeThresholdMB * 1024 * 1024;
      filteredFiles = filteredFiles.filter(f => f.size > sizeThreshold);
    }
    
    if (options.deleteOrphaned) {
      filteredFiles = filteredFiles.filter(f => !referencedUrls.has(f.name.split('/').pop() || ''));
    }
    
    if (options.maxFiles) {
      filteredFiles = filteredFiles.slice(0, options.maxFiles);
    }
    
    filteredFiles.forEach(file => {
      const isReferenced = referencedUrls.has(file.name.split('/').pop() || '');
      const name = file.name.length > 38 ? file.name.slice(0, 35) + '...' : file.name;
      const size = this.formatFileSize(file.size);
      const created = file.created.toISOString().split('T')[0];
      const referenced = isReferenced ? '✅' : '❌';
      
      console.log(name.padEnd(40), size.padEnd(12), created.padEnd(12), referenced);
    });
    
    console.log(`\nShowing ${filteredFiles.length} of ${files.length} total files\n`);
  }

  /**
   * Delete files based on criteria
   */
  public async cleanBucket(options: CleanupOptions = {}): Promise<void> {
    if (!this.storageClient) {
      throw new Error('Storage client not initialized');
    }

    console.log('\n🧹 Starting bucket cleanup...');
    
    const files = await this.getAllFiles();
    const referencedUrls = await getReferencedUrls();
    
    let filesToDelete = files;
    
    // Apply filters
    if (options.olderThanDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - options.olderThanDays);
      filesToDelete = filesToDelete.filter(f => f.created < cutoffDate);
      console.log(`📅 Filtering files older than ${options.olderThanDays} days`);
    }
    
    if (options.pattern) {
      const regex = new RegExp(options.pattern, 'i');
      filesToDelete = filesToDelete.filter(f => regex.test(f.name));
      console.log(`🔍 Filtering files matching pattern: ${options.pattern}`);
    }
    
    if (options.sizeThresholdMB) {
      const sizeThreshold = options.sizeThresholdMB * 1024 * 1024;
      filesToDelete = filesToDelete.filter(f => f.size > sizeThreshold);
      console.log(`📏 Filtering files larger than ${options.sizeThresholdMB}MB`);
    }
    
    if (options.deleteOrphaned) {
      filesToDelete = filesToDelete.filter(f => !referencedUrls.has(f.name.split('/').pop() || ''));
      console.log(`🗑️  Filtering orphaned files (not referenced in database)`);
    }
    
    if (options.maxFiles) {
      filesToDelete = filesToDelete.slice(0, options.maxFiles);
      console.log(`🔢 Limiting to first ${options.maxFiles} files`);
    }
    
    if (filesToDelete.length === 0) {
      console.log('✅ No files match the deletion criteria');
      return;
    }
    
    const totalSize = filesToDelete.reduce((sum, file) => sum + file.size, 0);
    
    console.log(`\n⚠️  Found ${filesToDelete.length} files to delete`);
    console.log(`💾 Total size to be freed: ${this.formatFileSize(totalSize)}`);
    
    if (options.dryRun) {
      console.log('\n🔍 DRY RUN - No files will actually be deleted');
      filesToDelete.forEach(file => {
        console.log(`  - ${file.name} (${this.formatFileSize(file.size)})`);
      });
      return;
    }
    
    // Interactive confirmation
    if (options.interactive) {
      console.log('\nFiles to be deleted:');
      filesToDelete.slice(0, 10).forEach(file => {
        console.log(`  - ${file.name} (${this.formatFileSize(file.size)})`);
      });
      
      if (filesToDelete.length > 10) {
        console.log(`  ... and ${filesToDelete.length - 10} more files`);
      }
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise<string>((resolve) => {
        readline.question('\n❓ Continue with deletion? (yes/no): ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
        console.log('❌ Deletion cancelled');
        return;
      }
    }
    
    // Perform deletion
    console.log('\n🗑️  Starting deletion process...');
    let deletedCount = 0;
    let failedCount = 0;
    
    for (const file of filesToDelete) {
      try {
        await this.storageClient.bucket(this.bucketName).file(file.name).delete();
        deletedCount++;
        console.log(`  ✅ Deleted: ${file.name}`);
      } catch (error) {
        failedCount++;
        console.error(`  ❌ Failed to delete ${file.name}:`, error);
      }
    }
    
    console.log(`\n📊 Cleanup completed:`);
    console.log(`  ✅ Successfully deleted: ${deletedCount} files`);
    console.log(`  ❌ Failed to delete: ${failedCount} files`);
    console.log(`  💾 Space freed: ${this.formatFileSize(totalSize)}`);
  }
}

// Helper function to get referenced URLs (needed for module scope)
async function getReferencedUrls(): Promise<Set<string>> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT stream_url FROM livestreams WHERE stream_url IS NOT NULL'
    );
    
    const referencedUrls = new Set<string>();
    const bucketName = process.env.GCP_BUCKET_NAME || 'livestakes-videos';
    
    result.rows.forEach(row => {
      if (row.stream_url) {
        const url = row.stream_url;
        if (url.includes(`storage.googleapis.com/${bucketName}/`)) {
          const filename = url.split('/').pop();
          if (filename) {
            referencedUrls.add(filename);
          }
        }
      }
    });
    
    return referencedUrls;
  } finally {
    client.release();
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🧹 Google Cloud Storage Bucket Cleaner for livestakes.fun

Usage:
  npm run clean-bucket <command> [options]

Commands:
  stats                           Show bucket statistics
  list [options]                  List files with optional filters
  clean [options]                 Delete files based on criteria

Options:
  --dry-run                       Show what would be deleted without actually deleting
  --older-than-days=N             Only process files older than N days
  --pattern="regex"               Only process files matching regex pattern
  --max-files=N                   Limit to first N files
  --size-threshold-mb=N           Only process files larger than N MB
  --delete-orphaned               Only process files not referenced in database
  --interactive                   Ask for confirmation before deletion
  --help, -h                      Show this help message

Examples:
  # Show bucket statistics
  npm run clean-bucket stats
  
  # List all files
  npm run clean-bucket list
  
  # List orphaned files (not in database)
  npm run clean-bucket list --delete-orphaned
  
  # Dry run: show files older than 30 days
  npm run clean-bucket clean --older-than-days=30 --dry-run
  
  # Delete orphaned files with confirmation
  npm run clean-bucket clean --delete-orphaned --interactive
  
  # Delete large files (>100MB) older than 7 days
  npm run clean-bucket clean --older-than-days=7 --size-threshold-mb=100 --interactive

Environment Variables Required:
  - GCP_PROJECT_ID
  - GCP_CLIENT_EMAIL
  - GCP_PRIVATE_KEY
  - GCP_BUCKET_NAME (optional, defaults to 'livestakes-videos')
  - POSTGRES_* variables for database connection
    `);
    process.exit(0);
  }

  try {
    const command = args[0];
    const flags = args.slice(1);
    
    // Parse options
    const options: CleanupOptions = {
      dryRun: flags.includes('--dry-run'),
      interactive: flags.includes('--interactive'),
      deleteOrphaned: flags.includes('--delete-orphaned')
    };
    
    // Parse numeric options
    const olderThanFlag = flags.find(f => f.startsWith('--older-than-days='));
    if (olderThanFlag) {
      options.olderThanDays = parseInt(olderThanFlag.split('=')[1]);
    }
    
    const maxFilesFlag = flags.find(f => f.startsWith('--max-files='));
    if (maxFilesFlag) {
      options.maxFiles = parseInt(maxFilesFlag.split('=')[1]);
    }
    
    const sizeThresholdFlag = flags.find(f => f.startsWith('--size-threshold-mb='));
    if (sizeThresholdFlag) {
      options.sizeThresholdMB = parseInt(sizeThresholdFlag.split('=')[1]);
    }
    
    const patternFlag = flags.find(f => f.startsWith('--pattern='));
    if (patternFlag) {
      options.pattern = patternFlag.split('=')[1].replace(/['"]/g, '');
    }
    
    const cleaner = new BucketCleaner();
    
    switch (command) {
      case 'stats':
        await cleaner.showStats();
        break;
        
      case 'list':
        await cleaner.listFiles(options);
        break;
        
      case 'clean':
        await cleaner.cleanBucket(options);
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Use --help for usage information');
        process.exit(1);
    }
    
    console.log('✅ Operation completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Operation failed:', error);
    process.exit(1);
  }
}

// Export for programmatic use
export default BucketCleaner;

// Run if called directly
if (require.main === module) {
  main();
} 