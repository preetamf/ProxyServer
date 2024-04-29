import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    signUp,
    login,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
} from "../controllers/user.controller.js"

const router = Router()

router.route("/signup").post( upload.single('file'), signUp );
router.route("/login").post(login);

//secured routes
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

export default router;