import express from "express"

import CountryController from "../controllers/countryController.js"

const router = express.Router()

router.get("/", CountryController.getAll)
router.get("/code/:code", CountryController.getByCode)
router.get("/name/:name", CountryController.getByName)
router.post("/", CountryController.create)
router.put("/code/:code", CountryController.update)
router.delete("/:code", CountryController.delete)

export { router as countryRoutes }
