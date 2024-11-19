import express from "express";

import OutbreakController from "../controllers/outbreakController.js";

const router = express.Router();

router.post("/", OutbreakController.create);
router.get("/", OutbreakController.getAll);
router.get("/cv/:cv", OutbreakController.getByVirusCode);
router.get("/cz/:cz", OutbreakController.getByZoneCode);
router.get("/active", OutbreakController.getAllActive);
router.get("/occurred", OutbreakController.getAllOccurred);
router.get("/co/:co", OutbreakController.getByCode);
router.put("/:co", OutbreakController.update);
router.delete("/:co", OutbreakController.delete); 

export { router as outbreakRoutes };