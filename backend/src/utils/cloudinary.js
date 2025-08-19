// src/utils/cloudinary.js - PROPERLY FIXED CLEANUP
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import path from 'path'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
    let normalizedPath = null;
    
    try {
        if (!localFilePath) return null;

        // Normalize path - this is crucial for Windows
        normalizedPath = localFilePath.replace(/\\/g, '/');
        
        console.log("=== CLEANUP DEBUG ===");
        console.log("Original path:", localFilePath);
        console.log("Normalized path:", normalizedPath);
        console.log("File exists before upload:", fs.existsSync(normalizedPath));

        if (!fs.existsSync(normalizedPath)) {
            console.error("File does not exist:", normalizedPath);
            return null;
        }

        const uploadOptions = {
            resource_type: resourceType,
            folder: "pixels-videos",
            use_filename: true,
            unique_filename: false,
        };

        if (resourceType === "video") {
            uploadOptions.eager = [
                { width: 300, height: 200, crop: "fill", format: "jpg" },
            ];
            uploadOptions.eager_async = true;
        }

        console.log("Starting Cloudinary upload:", normalizedPath);
        const result = await cloudinary.uploader.upload(normalizedPath, uploadOptions);
        
        console.log("Upload successful, now cleaning up:", normalizedPath);
        
        // CRITICAL: Cleanup after successful upload
        try {
            if (fs.existsSync(normalizedPath)) {
                fs.unlinkSync(normalizedPath);
                console.log("✅ TEMP FILE DELETED:", normalizedPath);
            } else {
                console.log("⚠️  File already gone:", normalizedPath);
            }
        } catch (cleanupError) {
            console.error("❌ CLEANUP FAILED:", normalizedPath, cleanupError.message);
        }
        
        console.log("File uploaded successfully:", result.secure_url);
        return result;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        
        // CRITICAL: Cleanup on error too
        if (normalizedPath && fs.existsSync(normalizedPath)) {
            try {
                fs.unlinkSync(normalizedPath);
                console.log("✅ TEMP FILE DELETED (after error):", normalizedPath);
            } catch (cleanupError) {
                console.error("❌ ERROR CLEANUP FAILED:", normalizedPath, cleanupError.message);
            }
        }
        
        return null;
    }
}

const uploadLargeVideoOnCloudinary = async (localFilePath) => {
    return new Promise((resolve, reject) => {
        if (!localFilePath) {
            resolve(null);
            return;
        }

        const normalizedPath = localFilePath.replace(/\\/g, '/');
        console.log("Large video upload path:", normalizedPath);

        cloudinary.uploader.upload_large(
            normalizedPath,
            {
                resource_type: "video",
                folder: "pixels-videos",
                chunk_size: 20000000,
                use_filename: true,
                unique_filename: false,
            },
            (error, result) => {
                // CRITICAL: Always cleanup large files
                console.log("Large upload finished, cleaning up:", normalizedPath);
                
                if (fs.existsSync(normalizedPath)) {
                    try {
                        fs.unlinkSync(normalizedPath);
                        console.log("✅ LARGE TEMP FILE DELETED:", normalizedPath);
                    } catch (cleanupError) {
                        console.error("❌ LARGE CLEANUP FAILED:", normalizedPath, cleanupError.message);
                    }
                }

                if (error) {
                    console.error("Large video upload failed:", error);
                    reject(error);
                } else {
                    console.log("Large video uploaded successfully:", result.secure_url);
                    resolve(result);
                }
            }
        );
    });
};

// Keep your existing signed URL functions
const generateSignedVideoUrl = (publicId, options = {}) => {
    try {
        const defaultOptions = {
            resource_type: "video",
            type: "upload",
            expires_at: Math.floor(Date.now() / 1000) + (options.expiresIn || 3600),
            secure: true,
            sign_url: true
        };

        const signedUrl = cloudinary.url(publicId, {
            ...defaultOptions,
            ...options
        });

        console.log("Generated signed URL for public_id:", publicId);
        return signedUrl;
    } catch (error) {
        console.error("Signed URL generation failed:", error);
        return null;
    }
}

const generateStreamingUrl = (publicId, options = {}) => {
    try {
        const transformOptions = {
            resource_type: "video",
            type: "upload",
            secure: true,
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + (options.expiresIn || 3600),
            ...options
        };

        return cloudinary.url(publicId, transformOptions);
    } catch (error) {
        console.error("Streaming URL generation failed:", error);
        return null;
    }
}

const extractPublicIdFromUrl = (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) {
            return null;
        }

        const urlParts = cloudinaryUrl.split('/');
        const videoIndex = urlParts.findIndex(part => part === 'video');
        
        if (videoIndex !== -1 && urlParts[videoIndex + 2]) {
            const filename = urlParts[videoIndex + 2].split('.')[0];
            const folder = urlParts[videoIndex + 1];
            return `${folder}/${filename}`;
        }
        
        return null;
    } catch (error) {
        console.error("Failed to extract public_id:", error);
        return null;
    }
}

export { 
    uploadOnCloudinary, 
    uploadLargeVideoOnCloudinary,
    generateSignedVideoUrl,
    generateStreamingUrl,
    extractPublicIdFromUrl
}
