import { writeFile, readFile, mkdir, unlink, readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export interface ApprovedFile {
  wordId: string;
  voiceUsed: string;
  localPath: string;
  s3Key: string;
}

export interface UploadResult {
  success: boolean;
  uploaded: number;
  failed: number;
  total: number;
  failedFiles: string[];
}

export class FileManager {
  private audioDir: string;
  private s3KeyPrefix: string;
  private s3Client: S3Client | null = null;
  private s3Config: { bucketName: string; region: string; keyPrefix: string } | null = null;

  constructor(audioDir = './audio-cache', s3KeyPrefix = 'voices') {
    this.audioDir = audioDir;
    this.s3KeyPrefix = s3KeyPrefix;
  }

  initializeS3(s3Config: { bucketName: string; region: string; keyPrefix: string }): void {
    this.s3Config = s3Config;
    this.s3Client = new S3Client({ region: s3Config.region });
  }

  async saveAudioFile(wordId: string, voice: string, audioBuffer: ArrayBuffer): Promise<string> {
    const voiceDir = join(this.audioDir, voice);
    const filePath = join(voiceDir, `${wordId}.mp3`);
    
    try {
      // Ensure directory exists
      await mkdir(voiceDir, { recursive: true });
      
      // Save audio file
      await writeFile(filePath, Buffer.from(audioBuffer));
      
      return filePath;
    } catch (error) {
      throw new Error(`Failed to save audio file: ${error instanceof Error ? error.message : error}`);
    }
  }

  async loadAudioFile(wordId: string, voice: string): Promise<ArrayBuffer> {
    const filePath = join(this.audioDir, voice, `${wordId}.mp3`);
    
    try {
      const buffer = await readFile(filePath);
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    } catch (error) {
      throw new Error(`Failed to load audio file: ${error instanceof Error ? error.message : error}`);
    }
  }

  async audioFileExists(wordId: string, voice: string): Promise<boolean> {
    const filePath = join(this.audioDir, voice, `${wordId}.mp3`);
    
    try {
      await readFile(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getGeneratedVoices(wordId: string): Promise<string[]> {
    const voices: { name: string; mtime: Date }[] = [];
    
    try {
      const voiceDirs = await readdir(this.audioDir);
      
      for (const voice of voiceDirs) {
        if (await this.audioFileExists(wordId, voice)) {
          const filePath = join(this.audioDir, voice, `${wordId}.mp3`);
          const stats = await stat(filePath);
          voices.push({ name: voice, mtime: stats.mtime });
        }
      }
    } catch {
      // Audio directory doesn't exist yet
    }
    
    // Sort by modification time (oldest first)
    voices.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());
    return voices.map(v => v.name);
  }

  async cleanupTempFiles(wordId: string, keepVoice?: string): Promise<void> {
    try {
      const voiceDirs = await readdir(this.audioDir);
      
      for (const voice of voiceDirs) {
        if (keepVoice && voice === keepVoice) {
          continue; // Keep the approved voice
        }
        
        const filePath = join(this.audioDir, voice, `${wordId}.mp3`);
        try {
          await unlink(filePath);
        } catch {
          // File might not exist, ignore
        }
      }
    } catch {
      // Directory might not exist, ignore
    }
  }

  async prepareApprovedFiles(): Promise<ApprovedFile[]> {
    const approvedFiles: ApprovedFile[] = [];
    
    try {
      const voiceDirs = await readdir(this.audioDir);
      
      for (const voice of voiceDirs) {
        const voiceDir = join(this.audioDir, voice);
        const files = await readdir(voiceDir);
        
        for (const file of files) {
          if (file.endsWith('.mp3')) {
            const wordId = file.replace('.mp3', '');
            const localPath = join(voiceDir, file);
            const s3Key = `${this.s3KeyPrefix}/${voice}/${file}`;
            
            approvedFiles.push({
              wordId,
              voiceUsed: voice,
              localPath,
              s3Key
            });
          }
        }
      }
    } catch {
      // Directory might not exist
    }
    
    return approvedFiles;
  }

  async getAudioCacheStats(): Promise<{ totalFiles: number; totalSize: number; voiceBreakdown: Record<string, number> }> {
    let totalFiles = 0;
    let totalSize = 0;
    const voiceBreakdown: Record<string, number> = {};
    
    try {
      const voiceDirs = await readdir(this.audioDir);
      
      for (const voice of voiceDirs) {
        const voiceDir = join(this.audioDir, voice);
        const files = await readdir(voiceDir);
        
        voiceBreakdown[voice] = files.filter(f => f.endsWith('.mp3')).length;
        totalFiles += voiceBreakdown[voice];
        
        // Calculate size (simplified - would need fs.stat for actual size)
        totalSize += voiceBreakdown[voice] * 50000; // Estimate 50KB per file
      }
    } catch {
      // Directory might not exist
    }
    
    return { totalFiles, totalSize, voiceBreakdown };
  }

  getS3Key(wordId: string, voice: string): string {
    return `${this.s3KeyPrefix}/${voice}/${wordId}.mp3`;
  }

  async ensureAudioDirectory(): Promise<void> {
    await mkdir(this.audioDir, { recursive: true });
  }

  async uploadToS3(approvedFiles: ApprovedFile[]): Promise<UploadResult> {
    if (!this.s3Client || !this.s3Config) {
      throw new Error('S3 not initialized. Call initializeS3() first.');
    }

    console.log(`📤 Starting S3 upload of ${approvedFiles.length} files...`);
    
    let uploaded = 0;
    let failed = 0;
    const failedFiles: string[] = [];

    for (let i = 0; i < approvedFiles.length; i++) {
      const file = approvedFiles[i];
      
      try {
        console.log(`📤 Uploading ${file.wordId} (${i + 1}/${approvedFiles.length})`);
        
        // Read the local file
        const fileBuffer = await readFile(file.localPath);
        
        // Upload to S3
        const command = new PutObjectCommand({
          Bucket: this.s3Config.bucketName,
          Key: file.s3Key,
          Body: fileBuffer,
          ContentType: 'audio/mpeg',
          CacheControl: 'public, max-age=31536000' // 1 year cache
        });
        
        await this.s3Client.send(command);
        uploaded++;
        
        // Show progress every 10 files
        if ((i + 1) % 10 === 0) {
          console.log(`📊 Upload progress: ${i + 1}/${approvedFiles.length} (${Math.round(((i + 1) / approvedFiles.length) * 100)}%)`);
        }
        
        // Rate limiting: small delay between uploads
        if (i < approvedFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.log(`❌ Failed to upload ${file.wordId}: ${error instanceof Error ? error.message : error}`);
        failed++;
        failedFiles.push(file.wordId);
      }
    }

    console.log(`✅ S3 upload complete: ${uploaded}/${approvedFiles.length} files uploaded`);
    
    return {
      success: failed === 0,
      uploaded,
      failed,
      total: approvedFiles.length,
      failedFiles
    };
  }

  async uploadSingleFile(wordId: string, voiceUsed: string, localPath: string): Promise<boolean> {
    if (!this.s3Client || !this.s3Config) {
      throw new Error('S3 not initialized. Call initializeS3() first.');
    }

    try {
      const s3Key = this.getS3Key(wordId, voiceUsed);
      const fileBuffer = await readFile(localPath);
      
      const command = new PutObjectCommand({
        Bucket: this.s3Config.bucketName,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: 'audio/mpeg',
        CacheControl: 'public, max-age=31536000'
      });
      
      await this.s3Client.send(command);
      console.log(`✅ Uploaded ${wordId} to S3: ${s3Key}`);
      return true;
      
    } catch (error) {
      console.log(`❌ Failed to upload ${wordId}: ${error instanceof Error ? error.message : error}`);
      return false;
    }
  }
}
