// src/routes/video.routes.js
import { Router } from 'express';
import express from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    streamVideo,
    getTrendingVideos,
    getExploreVideos,
    smartSearch
} from "../controllers/video.controller.js"
import {VerifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

// JSON parsing middleware
const jsonParser = express.json({ limit: '10mb' });
const urlencodedParser = express.urlencoded({ extended: true, limit: '10mb' });

// Public routes (no auth required, no JSON parsing needed for GET)
router.route("/").get(getAllVideos);
// ✅ CORRECT ORDER - Static routes first
router.route("/trending").get(getTrendingVideos);    // Static route
router.route("/explore").get(getExploreVideos);      // Static route
router.route("/smart-search").get(smartSearch);
router.route("/:videoId").get(getVideoById);         // Param route comes last
router.route("/:videoId/stream").get(streamVideo);   // Other param routes


// Protected routes (auth required)
router.use(VerifyJWT);

// File upload route - NO JSON parsing, only Multer
router.route("/").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishAVideo
);

// Routes that need JSON parsing and file upload
router
    .route("/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo); // Update might have JSON + file

// Routes that need JSON parsing only
router.route("/toggle/publish/:videoId").patch(jsonParser, urlencodedParser, togglePublishStatus);

export default router