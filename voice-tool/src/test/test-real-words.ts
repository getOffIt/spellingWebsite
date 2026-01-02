import { WordExtractor } from '../services/WordExtractor.js';

async function testRealWords() {
  console.log('🧪 Testing with Real Words File');
  
  const extractor = new WordExtractor();
  
  try {
    const words = await extractor.extractWords('./real-words.ts');
    
    console.log(`\n✅ Successfully extracted ${words.length} words from real words.ts`);
    
    // Show breakdown by year
    const year1Words = extractor.filterByYear(words, 1);
    const year2Words = extractor.filterByYear(words, 2);
    console.log(`📊 Year 1: ${year1Words.length} words`);
    console.log(`📊 Year 2: ${year2Words.length} words`);
    
    // Show breakdown by category
    const categories = extractor.groupByCategory(words);
    console.log(`\n📊 Categories found: ${categories.size}`);
    
    let totalShown = 0;
    for (const [category, categoryWords] of categories) {
      if (totalShown < 10) { // Show first 10 categories
        console.log(`  ${category}: ${categoryWords.length} words (${categoryWords.slice(0, 3).map(w => w.text).join(', ')}${categoryWords.length > 3 ? '...' : ''})`);
        totalShown++;
      }
    }
    
    if (categories.size > 10) {
      console.log(`  ... and ${categories.size - 10} more categories`);
    }
    
    // Validate all words
    const errors = extractor.validateWords(words);
    if (errors.length === 0) {
      console.log('\n✅ All words validated successfully');
    } else {
      console.log(`\n❌ Found ${errors.length} validation errors:`);
      errors.slice(0, 5).forEach(error => console.log(`  - ${error}`));
      if (errors.length > 5) {
        console.log(`  ... and ${errors.length - 5} more errors`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : error);
  }
}

testRealWords();
