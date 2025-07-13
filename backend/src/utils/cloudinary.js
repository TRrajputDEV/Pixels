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
        // Upload the file

        await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // upload completed here so a simple file upload
        console.log("file is uploaded babu...", response.url);

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // file unlink as it is cooked
        return null;
    }
}

export {uploadOnCloudinary}