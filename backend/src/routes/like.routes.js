// src/routes/like.routes.js
import { Router } from 'express';
import express from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {VerifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// JSON parsing middleware for POST routes
const jsonParser = express.json({ limit: '10mb' });
const urlencodedParser = express.urlencoded({ extended: true, limit: '10mb' });

router.use(VerifyJWT); // Apply verifyJWT middleware to all routes in this file

// POST routes need JSON parsing
router.route("/toggle/v/:videoId").post(jsonParser, urlencodedParser, toggleVideoLike);
router.route("/toggle/c/:commentId").post(jsonParser, urlencodedParser, toggleCommentLike);
router.route("/toggle/t/:tweetId").post(jsonParser, urlencodedParser, toggleTweetLike);

// GET route doesn't need JSON parsing
router.route("/videos").get(getLikedVideos);

export default router