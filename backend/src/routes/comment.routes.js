// src/routes/comment.routes.js
import { Router } from 'express';
import express from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {VerifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// JSON parsing middleware
const jsonParser = express.json({ limit: '10mb' });
const urlencodedParser = express.urlencoded({ extended: true, limit: '10mb' });

// Public route - anyone can read comments (no JSON parsing needed for GET)
router.route("/:videoId").get(getVideoComments);

// Protected routes - auth required for interactions
router.use(VerifyJWT);
router.route("/:videoId").post(jsonParser, urlencodedParser, addComment);
router.route("/c/:commentId")
    .delete(deleteComment)
    .patch(jsonParser, urlencodedParser, updateComment);

export default router