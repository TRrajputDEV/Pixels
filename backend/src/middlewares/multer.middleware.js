// src/middlewares/multer.middleware.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")  // Fixed path - should be relative to project root
    },
    filename: function (req, file, cb) {
        // Add timestamp to prevent filename conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// Enhanced file filter for all upload types
const fileFilter = (req, file, cb) => {
    // console.log('Processing file field:', file.fieldname, 'mimetype:', file.mimetype); // Debug log
    
    if (file.fieldname === 'videoFile') {
        // Accept only video files
        if (file.mimetype.startsWith('video/')) {
            cb(null, true)
        } else {
            cb(new Error('Only video files are allowed for videoFile'), false)
        }
    } else if (file.fieldname === 'thumbnail') {
        // Accept only image files for thumbnail
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed for thumbnail'), false)
        }
    } else if (file.fieldname === 'avatar') {
        // Accept only image files for avatar
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed for avatar'), false)
        }
    } else if (file.fieldname === 'coverImage') {
        // Accept only image files for cover image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed for coverImage'), false)
        }
    } else {
        // Log unexpected field for debugging
        // console.log('Unexpected field received:', file.fieldname);
        cb(new Error(`Unexpected field: ${file.fieldname}`), false)
    }
}

export const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB for videos, plenty for images too
        files: 2 // Maximum 2 files per request
    },
    fileFilter
})
