import express from "express"

import verifyToken from "../../middleware.js"
import OutbreakController from "../controllers/outbreakController.js"

const router = express.Router()

router.post("/",verifyToken, OutbreakController.create)
router.get("/",verifyToken, OutbreakController.getAll)
router.get("/condition/:condition",verifyToken, OutbreakController.getAllByCondition)
router.get("/co/:co",verifyToken, OutbreakController.getByCode)
router.get("/cv/:cv",verifyToken, OutbreakController.getByVirusCode)
router.get("/cz/:cz",verifyToken, OutbreakController.getByZoneCode)
router.get("/cc/:cc",verifyToken, OutbreakController.getByCountryCode)
router.put("/co/:co",verifyToken, OutbreakController.update)
router.put("/cz/cv/:cz/:cv",verifyToken, OutbreakController.updateByZoneCodeVirusCode)
router.delete("/:co",verifyToken, OutbreakController.delete)

export { router as outbreakRoutes }
