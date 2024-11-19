import express from "express"

import VirusController from "../controllers/virusController.js"

const router = express.Router()

router.post("/", VirusController.create);
router.get("/", VirusController.getAll);
router.get("/name/:name", VirusController.getByName);
router.get("/cv/:cv", VirusController.getByCode);
router.put("/:cv", VirusController.update);
router.delete("/:cv", VirusController.delete);

export { router as virusRoutes }
