import { readFile } from 'fs/promises';
import { Word } from '../types/index.js';

export class WordExtractor {
  async extractWords(filePath: string): Promise<Word[]> {
    try {
      const content = await readFile(filePath, 'utf8');
      return this.parseWordsFromContent(content);
    } catch (error) {
      throw new Error(`Failed to extract words from ${filePath}: ${error instanceof Error ? error.message : error}`);
    }
  }

  private parseWordsFromContent(content: string): Word[] {
    const words: Word[] = [];
    
    // Extract word objects using regex pattern
    const wordPattern = /{\s*id:\s*['"`]([^'"`]+)['"`],\s*text:\s*['"`]([^'"`]+)['"`],\s*year:\s*([12]),\s*category:\s*['"`]([^'"`]+)['"`]\s*}/g;
    
    let match;
    while ((match = wordPattern.exec(content)) !== null) {
      const [, id, text, yearStr, category] = match;
      const year = parseInt(yearStr) as 1 | 2;
      
      words.push({
        id: id.trim(),
        text: text.trim(),
        year,
        category: category.trim()
      });
    }

    if (words.length === 0) {
      throw new Error('No words found in the provided file. Check the file format.');
    }

    return words;
  }

  validateWords(words: Word[]): string[] {
    const errors: string[] = [];
    const seenIds = new Set<string>();

    for (const word of words) {
      // Check for duplicate IDs
      if (seenIds.has(word.id)) {
        errors.push(`Duplicate word ID: ${word.id}`);
      }
      seenIds.add(word.id);

      // Validate required fields
      if (!word.id || !word.text) {
        errors.push(`Invalid word: missing id or text for ${JSON.stringify(word)}`);
      }

      // Validate year
      if (word.year !== 1 && word.year !== 2) {
        errors.push(`Invalid year for word ${word.id}: must be 1 or 2`);
      }

      // Validate category
      if (!word.category) {
        errors.push(`Missing category for word ${word.id}`);
      }
    }

    return errors;
  }

  groupByCategory(words: Word[]): Map<string, Word[]> {
    const groups = new Map<string, Word[]>();
    
    for (const word of words) {
      if (!groups.has(word.category)) {
        groups.set(word.category, []);
      }
      groups.get(word.category)!.push(word);
    }

    return groups;
  }

  filterByYear(words: Word[], year: 1 | 2): Word[] {
    return words.filter(word => word.year === year);
  }
}
