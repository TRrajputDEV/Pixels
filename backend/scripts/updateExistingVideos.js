// backend/scripts/updateExistingVideos.js
import { Video } from '../src/models/video.model.js';
import { AutoTagger } from '../src/utils/autoTagging.js';
import connectDB from '../src/db/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const updateExistingVideos = async () => {
    try {
        console.log('🚀 Starting video update process...');

        // Connect to database
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Find videos without tags
        const videos = await Video.find({
            $or: [
                { tags: { $exists: false } },
                { tags: { $size: 0 } },
                { mood: { $exists: false } },
                { category: { $exists: false } }
            ]
        });

        console.log(`📊 Found ${videos.length} videos to update`);

        if (videos.length === 0) {
            console.log('✅ All videos already have tags!');
            process.exit(0);
        }

        let updated = 0;

        for (const video of videos) {
            console.log(`📝 Processing: ${video.title.substring(0, 50)}...`);

            // Generate tags, mood, and category
            const tags = AutoTagger.generateTags(video.title, video.description);
            const mood = AutoTagger.detectMood(video.title, video.description);
            const category = AutoTagger.detectCategory(video.title, video.description);

            // Update the video
            await Video.findByIdAndUpdate(video._id, {
                tags: tags,
                mood: mood,
                category: category,
                intent_keywords: tags,
                // Auto-categorize duration if not set
                duration_category: video.duration < 300 ? 'short' :
                    video.duration < 1200 ? 'medium' : 'long'
            });

            updated++;
            console.log(`✅ Updated (${updated}/${videos.length}): ${video.title}`);
            console.log(`   Tags: ${tags.join(', ')}`);
            console.log(`   Mood: ${mood || 'none'}`);
            console.log(`   Category: ${category}`);
            console.log('');
        }

        console.log(`🎉 Successfully updated ${updated} videos!`);
        console.log('✅ Script completed successfully');
        process.exit(0);

    } catch (error) {
        console.error('❌ Script failed:', error);
        process.exit(1);
    }
};

// Run the update
updateExistingVideos();
