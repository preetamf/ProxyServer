import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    signUp,
    login,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
    updateSubuser,
    usageStatDetails,
} from "../controllers/user.controller.js"

const router = Router()

router.route("/signup").post( upload.single('file'), signUp );
router.route("/login").post(login);

//secured routes
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

//sub-user routes
router.route("/update-subuser").post(updateSubuser)
router.route("/usage-details").get(usageStatDetails)

export default router;