// backend/src/utils/autoTagging.js
import { IntentMapper } from './intentMapping.js';

class AutoTagger {
    static generateTags(title, description) {
        const text = `${title} ${description}`.toLowerCase();
        const intents = IntentMapper.extractIntents(text);
        
        // Extract keywords from title/description
        const words = text.split(' ')
            .filter(word => word.length > 2)
            .filter(word => !this.stopWords.includes(word))
            .slice(0, 10);

        // Combine intent tags with extracted keywords
        const allTags = [...(intents?.tags || []), ...words];
        return [...new Set(allTags)]; // Remove duplicates
    }

    static detectMood(title, description) {
        const text = `${title} ${description}`.toLowerCase();
        const intents = IntentMapper.extractIntents(text);
        return intents?.mood || null;
    }

    static detectCategory(title, description) {
        const text = `${title} ${description}`.toLowerCase();
        const intents = IntentMapper.extractIntents(text);
        return intents?.category || 'other';
    }

    static stopWords = [
        'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
    ];
}

export { AutoTagger };
