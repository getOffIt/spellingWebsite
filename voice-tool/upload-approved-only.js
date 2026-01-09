#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

async function uploadApprovedOnly() {
  try {
    // Read progress file
    const progressPath = './progress/voice-generation-progress.json';
    const progressData = JSON.parse(await fs.readFile(progressPath, 'utf8'));
    
    console.log(`📊 Found ${Object.keys(progressData.words).length} words in progress file`);
    
    let uploadCount = 0;
    const approvedWords = [];
    
    // Find approved words and their selected voices
    for (const [wordId, wordData] of Object.entries(progressData.words)) {
      if (wordData.status === 'completed' && wordData.voiceUsed && wordData.localAudioPath) {
        const localPath = wordData.localAudioPath.startsWith('./') 
          ? wordData.localAudioPath 
          : `./${wordData.localAudioPath}`;
        
        // Check if file exists
        try {
          await fs.access(localPath);
          approvedWords.push({
            wordId,
            voice: wordData.voiceUsed,
            localPath,
            s3Key: `voices/${wordData.voiceUsed}/${wordId}.mp3`
          });
        } catch (error) {
          console.log(`⚠️  File not found: ${localPath}`);
        }
      }
    }
    
    console.log(`📤 Uploading ${approvedWords.length} approved voice files...`);
    
    // Upload each approved file
    for (const word of approvedWords) {
      try {
        const cmd = `aws s3 cp "${word.localPath}" "s3://spellmatereact/${word.s3Key}"`;
        execSync(cmd, { stdio: 'pipe' });
        uploadCount++;
        
        if (uploadCount % 10 === 0) {
          console.log(`📊 Upload progress: ${uploadCount}/${approvedWords.length} (${Math.round(uploadCount/approvedWords.length*100)}%)`);
        }
      } catch (error) {
        console.log(`❌ Failed to upload ${word.wordId}: ${error.message}`);
      }
    }
    
    console.log(`✅ Upload complete: ${uploadCount}/${approvedWords.length} files uploaded`);
    
    // Show summary by voice
    const voiceCounts = {};
    approvedWords.forEach(word => {
      voiceCounts[word.voice] = (voiceCounts[word.voice] || 0) + 1;
    });
    
    console.log('\n📊 Voice distribution:');
    Object.entries(voiceCounts).forEach(([voice, count]) => {
      console.log(`   ${voice}: ${count} words`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadApprovedOnly();
