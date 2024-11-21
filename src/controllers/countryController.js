import logger from "../logger.js"
import CountryService from "../services/countryService.js"

class CountryController {
  async create(req, res) {
    logger.info("POST: /api/countries - Request body: ", {
      body: JSON.stringify(req.body),
    })
    try {
      await CountryService.save(req.body)
      res.status(201).json({
        sucess: true,
        message: "Country created successfully",
        data: req.body,
      })
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res
          .status(400)
          .json({ sucess: false, message: errorMessage.trim(), error: err })
      } else if (err.code === 11000) {
        res.status(400).json({
          sucess: false,
          message:
            "Duplicate country code or country name. Please use unique values.",
          error: err,
        })
      } else {
        res.status(500).json({
          sucess: false,
          message: "Failed to create country",
          error: err,
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
        sucess: true,
        message: "Countries retrieved successfully",
        data: countries,
      })
    } catch (err) {
      logger.error("CountryController - Error retrieving countries - ", err)
      res.status(err.status || 500).json({
        sucess: false,
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
        sucess: true,
        message: "Country retrieved by code",
        data: country,
      })
    } catch (err) {
      logger.error(
        "CountryController - Error retrieving country by code - ",
        err
      )
      res.status(err.code === "NOT_FOUND" ? 404 : 500).json({
        sucess: false,
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
        sucess: true,
        message: "Country retrieved by name",
        data: country,
      })
    } catch (err) {
      logger.error(
        "CountryController - Error retrieving country by name - ",
        err
      )
      res.status(err.status || 500).json({
        sucess: false,
        message: "Failed to retrieve country by name",
        error: err,
      })
    }
  }

  async update(req, res) {
    const { cc } = req.params
    logger.info(`PUT: /api/countries/${cc} - Request body: `, {
      body: JSON.stringify(req.body),
    })

    try {
      const updatedCountry = await CountryService.update(cc, req.body)
      res.status(200).json({
        sucess: true,
        message: "Country updated successfully",
        data: updatedCountry,
      })
    } catch (err) {
      logger.error("CountryController - Error updating country - ", err)
      res.status(err.status || 500).json({
        sucess: false,
        message: "Failed to update country",
        error: err,
      })
    }
  }

  async delete(req, res) {
    const { cc } = req.params
    logger.info(`DELETE: /api/countries/cc/${cc}`)
    try {
      const deletedCountry = await CountryService.delete(cc)
      res.status(200).json({
        sucess: true,
        message: "Country deleted successfully",
        data: deletedCountry,
      })
    } catch (err) {
      logger.error("CountryController - Error deleting country - ", err)
      res.status(err.code === "NOT_FOUND" ? 404 : 500).json({
        sucess: false,
        message: "Failed to delete country",
        error: err,
      })
    }
  }
}

export default new CountryController()
