import express from "express";

import VirusController from "../controllers/virusController.js";

const router = express.Router();

router.post("/", VirusController.createVirus);
router.get("/", VirusController.getAllViruses);
router.get("/cv/:cv", VirusController.getVirusByCode);
router.get("/:cv/outbreaks", VirusController.getOutbreaksByVirusCode);
router.put("/:cv", VirusController.updateVirus);
router.delete("/:cv", VirusController.deleteVirus);

export { router as virusRoutes };
