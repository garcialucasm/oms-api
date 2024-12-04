import express from "express"

import verifyToken from "../../middleware.js"
import VirusController from "../controllers/virusController.js"

const router = express.Router()

router.post("/", /* verifyToken, */ VirusController.create)
router.get("/", /* verifyToken, */ VirusController.getAll)
router.get("/name/:name", /* verifyToken, */ VirusController.getByName)
router.get("/cv/:cv", /* verifyToken, */ VirusController.getByCode)
router.put("/:cv", /* verifyToken, */ VirusController.update)
router.delete("/:cv", /* verifyToken, */ VirusController.delete)

export { router as virusRoutes }
