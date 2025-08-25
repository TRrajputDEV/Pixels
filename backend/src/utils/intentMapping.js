// backend/src/utils/intentMapping.js
class IntentMapper {
    static intentMap = {
        // Mood-based intents
        'funny|comedy|laugh|hilarious|meme|humor|joke|lol': {
            tags: ['funny', 'comedy', 'memes', 'humor'],
            mood: 'funny',
            category: 'comedy'
        },
        'chill|relax|calm|peaceful|ambient|zen|soothing': {
            tags: ['chill', 'relaxing', 'ambient', 'peaceful'],
            mood: 'chill',
            category: 'lifestyle'
        },
        'learn|teach|tutorial|education|how.to|guide|explain|study': {
            tags: ['educational', 'tutorial', 'howto', 'learning', 'guide'],
            mood: 'educational',
            category: 'education'
        },
        'random|surprise|different|new|explore|discover|anything': {
            tags: ['explore', 'random', 'discover', 'surprise'],
            mood: 'random',
            category: 'other'
        },
        'exciting|thrilling|adventure|action|intense|epic': {
            tags: ['exciting', 'adventure', 'action', 'thrilling'],
            mood: 'exciting',
            category: 'other'
        },
        'inspiring|motivational|motivation|uplifting|positive': {
            tags: ['inspiring', 'motivational', 'uplifting', 'positive'],
            mood: 'inspiring',
            category: 'lifestyle'
        },
        
        // Activity-based intents
        'workout|fitness|exercise|gym|sports|training': {
            tags: ['fitness', 'workout', 'sports', 'training', 'health'],
            mood: 'exciting',
            category: 'fitness'
        },
        'cooking|recipe|food|kitchen|chef|baking': {
            tags: ['cooking', 'food', 'recipe', 'kitchen', 'chef'],
            mood: 'educational',
            category: 'cooking'
        },
        'coding|programming|tech|developer|software|computer': {
            tags: ['tech', 'programming', 'coding', 'developer', 'software'],
            mood: 'educational',
            category: 'tech'
        },
        'gaming|games|play|gamer|stream|gameplay': {
            tags: ['gaming', 'games', 'entertainment', 'gameplay'],
            mood: 'exciting',
            category: 'gaming'
        },
        'music|song|artist|band|concert|singing': {
            tags: ['music', 'songs', 'artist', 'entertainment'],
            mood: 'inspiring',
            category: 'music'
        },
        
        // Duration-based intents  
        'quick|short|brief|fast|under.*minute': {
            tags: ['quick', 'short'],
            duration_category: 'short'
        },
        'long|detailed|deep|comprehensive|full.*video|complete': {
            tags: ['detailed', 'comprehensive', 'complete'],
            duration_category: 'long'
        },
        
        // Time/mood context
        'bored|boring|kill.*time|pass.*time|nothing.*do': {
            tags: ['entertainment', 'random', 'explore'],
            mood: 'random'
        },
        'sleep|tired|bedtime|night': {
            tags: ['chill', 'relaxing', 'calm'],
            mood: 'chill'
        }
    };

    static extractIntents(query) {
        if (!query || typeof query !== 'string') return null;
        
        const normalizedQuery = query.toLowerCase().trim();
        const extractedIntents = {
            tags: [],
            mood: null,
            category: null,
            duration_category: null
        };

        // Pattern matching
        for (const [pattern, intentData] of Object.entries(this.intentMap)) {
            const regex = new RegExp(`\\b(${pattern.replace(/\|/g, '|')})\\b`, 'i');
            if (regex.test(normalizedQuery)) {
                if (intentData.tags) extractedIntents.tags.push(...intentData.tags);
                if (intentData.mood && !extractedIntents.mood) extractedIntents.mood = intentData.mood;
                if (intentData.category && !extractedIntents.category) extractedIntents.category = intentData.category;
                if (intentData.duration_category && !extractedIntents.duration_category) {
                    extractedIntents.duration_category = intentData.duration_category;
                }
            }
        }

        // Remove duplicates from tags
        extractedIntents.tags = [...new Set(extractedIntents.tags)];

        // If no specific intents found, extract meaningful keywords as tags
        if (extractedIntents.tags.length === 0) {
            const words = normalizedQuery.split(' ')
                .filter(word => word.length > 2)
                .filter(word => !this.stopWords.includes(word))
                .slice(0, 3); // Max 3 keywords
            extractedIntents.tags = words;
        }

        return extractedIntents;
    }

    static stopWords = [
        'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
        'a', 'an', 'i', 'you', 'me', 'we', 'they', 'show', 'find', 'get', 'want', 
        'need', 'some', 'any', 'something', 'anything', 'video', 'videos', 'watch'
    ];

    // Helper method to suggest intent queries
    static getSuggestions() {
        return [
            "Make me laugh",
            "Teach me something new", 
            "Surprise me completely",
            "Help me relax",
            "Something quick (under 5 min)",
            "Workout motivation",
            "Cooking inspiration",
            "Learn coding",
            "Music to vibe to",
            "Gaming content"
        ];
    }
}

export { IntentMapper };
