// src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
    try {
        if (!localFilePath) return null;

        // Check if file exists before uploading
        if (!fs.existsSync(localFilePath)) {
            console.error("File does not exist:", localFilePath);
            return null;
        }

        // Upload configuration
        const uploadOptions = {
            resource_type: resourceType,
            folder: "pixels-videos", // Organize uploads in folders
            use_filename: true,
            unique_filename: false,
        };

        // For videos, add video-specific options
        if (resourceType === "video") {
            uploadOptions.eager = [
                { width: 300, height: 200, crop: "fill", format: "jpg" }, // Generate thumbnail
            ];
            uploadOptions.eager_async = true;
        }

        const result = await cloudinary.uploader.upload(localFilePath, uploadOptions);

        // Clean up temp file after successful upload
        fs.unlinkSync(localFilePath);
        
        console.log("File uploaded successfully:", result.secure_url);
        return result;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        
        // Clean up temp file on error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return null;
    }
}

// For large video files (>100MB)
const uploadLargeVideoOnCloudinary = async (localFilePath) => {
    return new Promise((resolve, reject) => {
        if (!localFilePath) {
            resolve(null);
            return;
        }

        cloudinary.uploader.upload_large(
            localFilePath,
            {
                resource_type: "video",
                folder: "pixels-videos",
                chunk_size: 20000000, // 20MB chunks
                use_filename: true,
                unique_filename: false,
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
                    console.log("Large video uploaded:", result.secure_url);
                    resolve(result);
                }
            }
        );
    });
};

export { uploadOnCloudinary, uploadLargeVideoOnCloudinary }