import { Router } from "express";
import { registerUser, loginUser, logoutuser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails,updateUserAvatar,updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
const router = Router();
import {upload} from '../middlewares/multer.middleware.js'
import { VerifyJWT } from "../middlewares/auth.middleware.js";

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

// secured route
router.route("/logout").post(VerifyJWT,  logoutuser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-Password").post(VerifyJWT, changeCurrentPassword);
router.route("/current-user").get(VerifyJWT, getCurrentUser);
router.route("/update-Details").patch(VerifyJWT, updateAccountDetails)

router.route("/avatar").patch(VerifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(VerifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(VerifyJWT, getUserChannelProfile)
router.route("/history").get(VerifyJWT, getWatchHistory)
export default router