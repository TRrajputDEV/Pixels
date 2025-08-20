import { Router } from 'express';
import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutuser, 
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { VerifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// Create JSON parsers for specific routes
const jsonParser = express.json({ limit: "10mb" });
const urlencodedParser = express.urlencoded({ extended: true, limit: "10mb" });

// ✅ MULTIPART ROUTES - NO JSON PARSING (Multer handles these)
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 }, 
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)

router.route("/avatar").patch(
    VerifyJWT, 
    upload.single("avatar"),
    updateUserAvatar
)

router.route("/cover-image").patch(
    VerifyJWT, 
    upload.single("coverImage"),
    updateUserCoverImage
)

// ✅ JSON ROUTES - ADD JSON PARSING
router.route("/login").post(jsonParser, urlencodedParser, loginUser)
router.route("/refresh-token").post(jsonParser, urlencodedParser, refreshAccessToken)
router.route("/logout").post(jsonParser, urlencodedParser, VerifyJWT, logoutuser)
router.route("/change-password").post(jsonParser, urlencodedParser, VerifyJWT, changeCurrentPassword)
router.route("/update-account").patch(jsonParser, urlencodedParser, VerifyJWT, updateAccountDetails)

// ✅ GET ROUTES - NO PARSING NEEDED
router.route("/current-user").get(VerifyJWT, getCurrentUser)
router.route("/c/:username").get(VerifyJWT, getUserChannelProfile)
router.route("/history").get(VerifyJWT, getWatchHistory)

export default router
