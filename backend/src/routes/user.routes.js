import { Router } from "express";
import { registerUser, loginUser, logoutuser } from "../controllers/user.controller.js";
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

router.route("/logout").post(VerifyJWT,  logoutuser)

export default router