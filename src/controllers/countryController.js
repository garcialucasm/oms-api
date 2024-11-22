import logger from "../logger.js"
import CountryService from "../services/countryService.js"

class CountryController {
  async create(req, res) {
    logger.info("POST: /api/countries")
    try {
      await CountryService.save(req.body)
      res.status(201).json({
        message: "Country created successfully",
        data: req.body,
      })
    } catch (err) {
      logger.error("CountryController - Error creating country - ", err)
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ message: errorMessage.trim(), error: err })
      } else if (err.code === 11000) {
        res.status(400).json({
          message:
            "Duplicate country code or country name. Please use unique values.",
          error: err,
        })
      } else if (err.message === "InvalidCountryName") {
        res.status(400).json({
          error:
            "Country not found with the given country name. Please enter the country name in English.",
        })
      } else if (err.message === "ZoneNotFound") {
        res
          .status(400)
          .json({ error: "Zone not found with the given zone code." })
      } else {
        res.status(500).json({
          message: "Failed to create country",
          error: err.message,
        })
      }
    }
  }

  async getAll(req, res) {
    logger.info("GET: /api/countries - Request body: ", {
      body: JSON.stringify(req.body),
    })

    try {
      const countries = await CountryService.list()
      res.status(200).json({
        message: "Countries retrieved successfully",
        data: countries,
      })
    } catch (err) {
      logger.error("CountryController - Error retrieving countries - ", err)
      res.status(500).json({
        message: "Failed to retrieve countries",
        error: err,
      })
    }
  }

  async getByCode(req, res) {
    const { cc } = req.params
    logger.info(`GET: /api/countries/cc/${cc}`)
    try {
      const country = await CountryService.list({ cc })
      res.status(200).json({
        message: "Country retrieved by code",
        data: country,
      })
    } catch (err) {
      logger.error(
        "CountryController - Error retrieving country by code - ",
        err
      )
      if (err.message === "CountryNotFound") {
        res.status(404).json({ error: "Country not found." })
      } else
        res.status(500).json({
          message: "Failed to retrieve country by code",
          error: err,
        })
    }
  }

  async getByName(req, res) {
    const { name: countryName } = req.params
    logger.info(`GET: /api/countries/name/${countryName}`)
    try {
      const country = await CountryService.list({
        name: countryName,
      })
      res.status(200).json({
        message: "Country retrieved by name",
        data: country,
      })
    } catch (err) {
      logger.error(
        "CountryController - Error retrieving country by name - ",
        err
      )
      res.status(500).json({
        message: "Failed to retrieve country by name",
        error: err,
      })
    }
  }

  async update(req, res) {
    const { cc } = req.params
    logger.info(`PUT: /api/countries/${cc}`)

    try {
      const updatedCountry = await CountryService.update(cc, req.body)
      res.status(200).json({
        message: "Country updated successfully",
        data: updatedCountry,
      })
    } catch (err) {
      if (err.message === "CountryNotFound") {
        res.status(404).json({ error: "Country not found" })
      } else if (err.message === "ZoneNotFound") {
        res
          .status(400)
          .json({ error: "Zone not found with the given zone code" })
      } else {
        logger.error("CountryController - Error updating country - ", err)
        res.status(500).json({
          message: "Failed to update country",
          error: err,
        })
      }
    }
  }

  async delete(req, res) {
    const { cc } = req.params
    logger.info(`DELETE: /api/countries/cc/${cc}`)
    try {
      const deletedCountry = await CountryService.delete(cc)
      res.status(200).json({
        message: "Country deleted successfully",
        data: deletedCountry,
      })
    } catch (err) {
      logger.error("CountryController - Error deleting country - ", err)
      if (err.message === "CountryNotFound") {
        res.status(404).json({ error: "Country not found." })
      } else
        res.status(500).json({
          message: "Failed to delete country",
          error: err,
        })
    }
  }
}

export default new CountryController()
