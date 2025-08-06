// src/routes/comment.routes.js
import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {VerifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// Public route - anyone can read comments
router.route("/:videoId").get(getVideoComments);

// Protected routes - auth required for interactions
router.use(VerifyJWT);
router.route("/:videoId").post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router
