import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // delete the temp file after successful upload
        fs.unlinkSync(localFilePath);

        console.log("file is uploaded babu...", result.secure_url);

        return result; // return actual cloudinary response
    } catch (error) {
        console.error("Cloudinary upload failed: ", error);
        fs.unlinkSync(localFilePath); // remove temp file on error too
        return null;
    }
}


export {uploadOnCloudinary}