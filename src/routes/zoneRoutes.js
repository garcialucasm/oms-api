import express from "express";
import zoneController from "../controllers/zoneController.js";

const router = express.Router();

router.post("/", zoneController.createZone);
router.get("/", zoneController.getAllZones);
router.get("/name/:name", zoneController.getZonesByName);
router.get("/cz/:cz", zoneController.getZonesByCode);
router.put("/:cz", zoneController.updateZoneByCode);
router.delete("/:cz", zoneController.deleteZoneByCode);

export { router as zoneRoutes };
