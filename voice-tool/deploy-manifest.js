#!/usr/bin/env node

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';

const s3Client = new S3Client({ region: 'eu-west-2' });

async function deployManifest() {
  try {
    const manifest = readFileSync('../public/voices/voice-manifest.json', 'utf8');
    
    const command = new PutObjectCommand({
      Bucket: 'spellmatereact',
      Key: 'voices/voice-manifest.json',
      Body: manifest,
      ContentType: 'application/json',
      CacheControl: 'public, max-age=3600'
    });
    
    await s3Client.send(command);
    console.log('✅ Voice manifest deployed to S3');
  } catch (error) {
    console.error('❌ Failed to deploy manifest:', error);
    process.exit(1);
  }
}

deployManifest();
