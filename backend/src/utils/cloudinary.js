// src/utils/cloudinary.js - SECURED VERSION
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Enhanced upload function with security options
const uploadOnCloudinary = async (localFilePath, resourceType = "auto", accessMode = "private") => {
    try {
        if (!localFilePath) return null;

        // Check if file exists before uploading
        if (!fs.existsSync(localFilePath)) {
            console.error("File does not exist:", localFilePath);
            return null;
        }

        // Determine folder based on resource type for better organization
        const folder = resourceType === "video" ? "pixels/videos" : "pixels/images";

        // Upload configuration with security
        const uploadOptions = {
            resource_type: resourceType,
            folder: folder,
            use_filename: true,
            unique_filename: false,
            access_mode: accessMode, // 🔐 SECURE: private/authenticated/public
            type: accessMode === "authenticated" ? "authenticated" : "upload"
        };

        // For videos, add video-specific options
        if (resourceType === "video") {
            uploadOptions.eager = [
                { width: 300, height: 200, crop: "fill", format: "jpg" }, // Generate thumbnail
                { width: 800, height: 600, crop: "fit", format: "jpg" },  // Medium thumbnail
            ];
            uploadOptions.eager_async = true;
            
            // Add video optimization settings
            uploadOptions.video_codec = "auto";
            uploadOptions.quality = "auto";
        }

        // For images, add image-specific optimizations
        if (resourceType === "image") {
            uploadOptions.quality = "auto";
            uploadOptions.fetch_format = "auto";
        }

        const result = await cloudinary.uploader.upload(localFilePath, uploadOptions);

        // Clean up temp file after successful upload
        fs.unlinkSync(localFilePath);
        
        console.log(`🔐 Secure file uploaded (${accessMode}):`, result.public_id);
        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            access_mode: accessMode
        };

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        
        // Clean up temp file on error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return null;
    }
}

// Enhanced large video upload with security
const uploadLargeVideoOnCloudinary = async (localFilePath, accessMode = "private") => {
    return new Promise((resolve, reject) => {
        if (!localFilePath) {
            resolve(null);
            return;
        }

        cloudinary.uploader.upload_large(
            localFilePath,
            {
                resource_type: "video",
                folder: "pixels/videos",
                chunk_size: 20000000, // 20MB chunks
                use_filename: true,
                unique_filename: false,
                access_mode: accessMode, // 🔐 SECURE: Set access mode
                type: accessMode === "authenticated" ? "authenticated" : "upload",
                video_codec: "auto",
                quality: "auto",
                eager: [
                    { width: 300, height: 200, crop: "fill", format: "jpg" },
                    { width: 800, height: 600, crop: "fit", format: "jpg" }
                ],
                eager_async: true
            },
            (error, result) => {
                // Clean up temp file
                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }

                if (error) {
                    console.error("Large video upload failed:", error);
                    reject(error);
                } else {
                    console.log(`🔐 Large video uploaded securely (${accessMode}):`, result.public_id);
                    resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        url: result.url,
                        format: result.format,
                        resource_type: result.resource_type,
                        bytes: result.bytes,
                        width: result.width,
                        height: result.height,
                        access_mode: accessMode
                    });
                }
            }
        );
    });
};

// Generate secure signed URL for accessing private/authenticated assets
const generateSecureUrl = (publicId, options = {}) => {
    try {
        const {
            resourceType = "image",
            transformation = {},
            expiresAt = Math.floor(Date.now() / 1000) + 3600, // Default: 1 hour from now
            accessMode = "private"
        } = options;

        // Generate signed URL for secure access
        const signedUrl = cloudinary.url(publicId, {
            resource_type: resourceType,
            type: accessMode === "authenticated" ? "authenticated" : "private",
            sign_url: true,
            auth_token: {
                duration: 3600, // 1 hour validity
                start_time: Math.floor(Date.now() / 1000),
                key: process.env.CLOUDINARY_API_SECRET
            },
            ...transformation
        });

        console.log(`🔐 Generated secure URL for: ${publicId}`);
        return signedUrl;

    } catch (error) {
        console.error("Failed to generate secure URL:", error);
        return null;
    }
};

// Utility to delete assets from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        
        console.log(`🗑️ Deleted from Cloudinary: ${publicId}`);
        return result;
    } catch (error) {
        console.error("Failed to delete from Cloudinary:", error);
        return null;
    }
};

export { 
    uploadOnCloudinary, 
    uploadLargeVideoOnCloudinary, 
    generateSecureUrl,
    deleteFromCloudinary 
};
