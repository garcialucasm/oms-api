import express from "express"

import verifyToken from "../../middleware.js"
import UserController from "../controllers/userController.js"

const router = express.Router()

router.post("/register"/* , verifyToken */, UserController.register)
router.post("/login", UserController.login)
router.put("/markinactive/:username", verifyToken, UserController.markInactive)
router.put("/update/:username", verifyToken, UserController.updateUser)

export { router as userRoutes }
