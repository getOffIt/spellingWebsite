import { WordExtractor } from '../services/WordExtractor.js';

async function testWordExtraction() {
  console.log('🧪 Testing Word Extraction');
  
  const extractor = new WordExtractor();
  
  try {
    // Test with our test file
    const words = await extractor.extractWords('./test-words.ts');
    
    console.log(`\n✅ Extracted ${words.length} words:`);
    words.forEach((word, index) => {
      console.log(`  ${index + 1}. ${word.text} (id: ${word.id}, year: ${word.year}, category: ${word.category})`);
    });
    
    // Test validation
    const errors = extractor.validateWords(words);
    if (errors.length > 0) {
      console.log('\n❌ Validation errors:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('\n✅ All words validated successfully');
    }
    
    // Test grouping by category
    const groups = extractor.groupByCategory(words);
    console.log(`\n📊 Words grouped by category:`);
    for (const [category, categoryWords] of groups) {
      console.log(`  ${category}: ${categoryWords.map(w => w.text).join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : error);
  }
}

testWordExtraction();
