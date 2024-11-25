import express from "express"

import verifyToken from "../../middleware.js"
import CountryController from "../controllers/countryController.js"

const router = express.Router()

router.post("/", CountryController.create)
router.get("/", CountryController.getAll)
router.get("/cc/:cc", CountryController.getByCode)
router.get("/name/:name", CountryController.getByName)
router.put("/cc/:cc", CountryController.update)
router.delete("/cc/:cc", CountryController.delete)

export { router as countryRoutes }
