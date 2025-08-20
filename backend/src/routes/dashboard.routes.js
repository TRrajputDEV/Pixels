// src/routes/dashboard.routes.js
import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
import {VerifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// No JSON parsing needed for dashboard routes since they are all GET requests
router.use(VerifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router