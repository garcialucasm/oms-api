import express from "express"

import verifyToken from "../../middleware.js"
import UserController from "../controllers/userController.js"

const router = express.Router()

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.delete("/:username", verifyToken, UserController.markInactive)
router.put("/activate/:username", verifyToken, UserController.markActive)
router.put("/update/:username", verifyToken, UserController.updateUser)

export { router as userRoutes }
