// src/routes/video.routes.js - Add streaming route
import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    streamVideo // Import new streaming method
} from "../controllers/video.controller.js"
import {VerifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

// Public routes (no auth required)
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);

// NEW: Secure video streaming endpoint (no auth required for now, but can be added)
router.route("/:videoId/stream").get(streamVideo);

// Protected routes (auth required)
router.use(VerifyJWT);

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

router
    .route("/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router
