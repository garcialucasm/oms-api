import logger from "../logger.js"
import CountryService from "../services/countryService.js"

class CountryController {
  async getAll(req, res) {
    logger.info("GET: /api/country - Request body: " + JSON.stringify(req.body))
    try {
      const countries = await CountryService.getAll()
      logger.debug("CountryController - getAll")
      res.status(200).json(countries)
    } catch (err) {
      logger.error("Error retrieving countries")
      res.status(500).json("Error retrieving countries")
    }
  }

  async getByCode(req, res) {
    const { code } = req.params
    logger.info(`GET: /api/country/${code}`)
    try {
      const country = await CountryService.getByCode(code)
      if (!country) {
        return errorResponse(res, 404, "Country not found")
      }
      logger.debug("CountryController - getByCode")
      res.status(200).json(country)
    } catch (err) {
      logger.error("Error retrieving country")
      res.status(500).json("Error retrieving country")
    }
  }

  async getByName(req, res) {
    const { countryName } = req.params
    logger.info(`GET: /api/country/${countryName}`)
    try {
      const country = await CountryService.getByName(countryName)
      if (!country) {
        return errorResponse(res, 404, "Country not found")
      }
      logger.debug("CountryController - getByName")
      res.status(200).json(country)
    } catch (err) {
      logger.error("Error retrieving country")
      res.status(500).json("Error retrieving country")
    }
  }

  async create(req, res) {
    logger.info(
      "POST: /api/country - Request body: " + JSON.stringify(req.body)
    )
    try {
      const country = await CountryService.create(req.body)
      logger.debug("CountryController - create")
      res.status(201).json(country)
    } catch (err) {
      logger.error("Error creating country")
      res.status(500).json("Error creating country")
    }
  }

  async update(req, res) {
    const { id } = req.params
    logger.info(
      `PUT: /api/country/${id} - Request body: ` + JSON.stringify(req.body)
    )
    try {
      const updatedCountry = await CountryService.update(id, req.body)
      if (!updatedCountry) {
        return errorResponse(res, 404, "Country not found")
      }
      logger.debug("CountryController - update")
      res.status(200).json(updatedCountry)
    } catch (err) {
      logger.error("Error updating country")
      errorResponse(res, 500, "Error creating country", err)
    }
  }

  async delete(req, res) {
    const { id } = req.params
    logger.info(`DELETE: /api/country/${id}`)
    try {
      const deletedCountry = await CountryService.delete(id)
      if (!deletedCountry) {
        return errorResponse(res, 404, "Country not found")
      }
      logger.debug("CountryController - delete")
      successResponse(res, 200, {
        message: "Country deleted successfully",
      })
    } catch (err) {
      logger.error("Error deleting country")
      errorResponse(res, 500, "Error deleting country", err)
    }
  }
}

export default new CountryController()
