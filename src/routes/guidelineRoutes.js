import express from "express"

import guidelineController from "../controllers/guidelineController.js"

const router = express.Router()

router.post("/", guidelineController.createGuideline)
router.get("/", guidelineController.getAllGuidelines)
router.get("/cg/:cg", guidelineController.getGuidelinesByCode)
router.get("/status/:status", guidelineController.getGuidelinesByStatus)
router.get("/co/:co", guidelineController.getGuidelineByCountryAndOutbreak)
router.put("/:cg", guidelineController.updateGuidelineByCode)
router.delete("/:cg", guidelineController.deleteGuidelineByCode)

export { router as guidelineRoutes }
