// src/utils/cleanup.js - Manual cleanup utility
import fs from 'fs';
import path from 'path';

export const cleanupTempDirectory = () => {
    const tempDir = path.resolve('public', 'temp');
    
    console.log("=== MANUAL CLEANUP ===");
    console.log("Temp directory:", tempDir);
    
    try {
        if (!fs.existsSync(tempDir)) {
            console.log("Temp directory doesn't exist");
            return;
        }

        const files = fs.readdirSync(tempDir);
        console.log(`Found ${files.length} files in temp directory`);

        files.forEach(file => {
            if (file === '.gitkeep') return; // Skip gitkeep
            
            const filePath = path.join(tempDir, file);
            try {
                fs.unlinkSync(filePath);
                console.log("✅ DELETED:", file);
            } catch (error) {
                console.error("❌ FAILED to delete:", file, error.message);
            }
        });

        console.log("Manual cleanup completed");
    } catch (error) {
        console.error("Cleanup directory error:", error);
    }
};

// Auto cleanup on process exit
process.on('exit', cleanupTempDirectory);
process.on('SIGINT', () => {
    cleanupTempDirectory();
    process.exit(0);
});
