// src/middlewares/multer.middleware.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./backend/public/temp")  // Remove 'backend/' - should be relative to where you run the server
    },
    filename: function (req, file, cb) {
        // Add timestamp to prevent filename conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// File filter for validation
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'videoFile') {
        // Accept only video files
        if (file.mimetype.startsWith('video/')) {
            cb(null, true)
        } else {
            cb(new Error('Only video files are allowed for videoFile'), false)
        }
    } else if (file.fieldname === 'thumbnail') {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed for thumbnail'), false)
        }
    } else {
        cb(new Error('Unexpected field'), false)
    }
}

export const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB for videos
        files: 2 // Maximum 2 files (video + thumbnail)
    },
    fileFilter
})
