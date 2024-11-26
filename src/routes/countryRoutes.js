import express from "express"

import verifyToken from "../../middleware.js"
import CountryController from "../controllers/countryController.js"

const router = express.Router()

router.post("/", verifyToken, CountryController.create)
router.get("/", verifyToken, CountryController.getAll)
router.get("/cc/:cc", verifyToken, CountryController.getByCode)
router.get("/name/:name", verifyToken, CountryController.getByName)
router.put("/cc/:cc", verifyToken, CountryController.update)
router.delete("/cc/:cc", verifyToken, CountryController.delete)

export { router as countryRoutes }
