#!/usr/bin/env node

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'eu-west-2' });

async function generateVoiceManifest() {
  const manifest = {};
  
  try {
    const command = new ListObjectsV2Command({
      Bucket: 'spellmatereact',
      Prefix: 'voices/',
    });
    
    const response = await s3Client.send(command);
    
    if (response.Contents) {
      for (const object of response.Contents) {
        const key = object.Key;
        if (key?.endsWith('.mp3')) {
          // Extract word from path: voices/rachel/cat.mp3 -> cat
          const parts = key.split('/');
          const filename = parts[parts.length - 1];
          const wordId = filename.replace('.mp3', '');
          
          // Only add if not already in manifest (first-found wins)
          if (!manifest[wordId]) {
            manifest[wordId] = `https://spellingninjas.com/${key}`;
          }
        }
      }
    }
    
    console.log(JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.error('Failed to generate manifest:', error);
    process.exit(1);
  }
}

generateVoiceManifest();
