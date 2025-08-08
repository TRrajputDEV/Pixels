// src/routes/subscription.routes.js - FIXED VERSION
import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {VerifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(VerifyJWT); // Apply verifyJWT middleware to all routes in this file

// FIXED: Route mapping
router
    .route("/c/:channelId")
    .post(toggleSubscription);  // Subscribe/unsubscribe to a channel

router.route("/channels").get(getSubscribedChannels);  // Get user's subscribed channels

router.route("/subscribers/:channelId").get(getUserChannelSubscribers);  // Get subscribers of a channel

export default router
