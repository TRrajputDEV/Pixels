// src/routes/user.routes.js
import { Router } from 'express';
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

// Public routes
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)

// Protected routes
router.route("/logout").post(VerifyJWT, logoutuser)
router.route("/change-password").post(VerifyJWT, changeCurrentPassword)
router.route("/current-user").get(VerifyJWT, getCurrentUser)
router.route("/update-account").patch(VerifyJWT, updateAccountDetails)

// Image update routes - THESE ARE THE KEY FIXES
router.route("/avatar").patch(
    VerifyJWT, 
    upload.single("avatar"),  // Single file with field name "avatar"
    updateUserAvatar
)

router.route("/cover-image").patch(
    VerifyJWT, 
    upload.single("coverImage"),  // Single file with field name "coverImage"
    updateUserCoverImage
)

// Channel and history routes
router.route("/c/:username").get(VerifyJWT, getUserChannelProfile)
router.route("/history").get(VerifyJWT, getWatchHistory)

export default router
