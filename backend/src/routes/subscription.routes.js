// src/routes/subscription.routes.js
import { Router } from 'express';
import express from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {VerifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// JSON parsing middleware for POST routes
const jsonParser = express.json({ limit: '10mb' });
const urlencodedParser = express.urlencoded({ extended: true, limit: '10mb' });

router.use(VerifyJWT); // Apply verifyJWT middleware to all routes in this file

// POST route needs JSON parsing
router
    .route("/c/:channelId")
    .post(jsonParser, urlencodedParser, toggleSubscription);

// GET routes don't need JSON parsing
router.route("/channels").get(getSubscribedChannels);
router.route("/subscribers/:channelId").get(getUserChannelSubscribers);

export default router