import express from "express"

import OutbreakController from "../controllers/outbreakController.js"

const router = express.Router()

router.post("/", OutbreakController.create)
router.get("/", OutbreakController.getAll)
router.get("/condition/:condition", OutbreakController.getAllByCondition)
router.get("/co/:co", OutbreakController.getByCode)
router.get("/cv/:cv", OutbreakController.getByVirusCode)
router.get("/cz/:cz", OutbreakController.getByZoneCode)
router.put("/co/:co", OutbreakController.update)
router.put("/:cz/:cv", OutbreakController.updateByZoneCodeVirusCode)
router.delete("/:co", OutbreakController.delete)

export { router as outbreakRoutes }
