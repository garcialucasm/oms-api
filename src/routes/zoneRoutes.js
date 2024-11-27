import express from "express"
import verifyToken from "../../middleware.js"

import zoneController from "../controllers/zoneController.js"

const router = express.Router()

router.post("/", verifyToken, zoneController.createZone)
router.get("/", verifyToken, zoneController.getAllZones)
router.get("/name/:name", verifyToken, zoneController.getZonesByName)
router.get("/cz/:cz", verifyToken, zoneController.getZonesByCode)
router.put("/:cz", verifyToken, zoneController.updateZoneByCode)
router.delete("/:cz", verifyToken, zoneController.deleteZoneByCode)

export { router as zoneRoutes }
