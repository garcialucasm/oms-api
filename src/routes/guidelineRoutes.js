import express from "express"

import verifyToken from "../../middleware.js"
import guidelineController from "../controllers/guidelineController.js"

const router = express.Router()

router.post("/",verifyToken, guidelineController.createGuideline)
router.get("/",verifyToken, guidelineController.getAllGuidelines)
router.get("/cg/:cg",verifyToken, guidelineController.getGuidelinesByCode)
router.get("/status/:status",verifyToken, guidelineController.getGuidelinesByStatus)
router.put("/:cg",verifyToken, guidelineController.updateGuidelineByCode)
router.delete("/expired/:cg",verifyToken, guidelineController.deleteExpiredGuidelineByCode)
router.delete("/:cg",verifyToken, guidelineController.deleteGuidelineByCode)

export { router as guidelineRoutes }
