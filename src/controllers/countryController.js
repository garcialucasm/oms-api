import logger from "../logger.js"
import CountryService from "../services/countryService.js"
import CountryInputDTO from "../DTO/countryInputDTO.js"
import CountryOutputDTO from "../DTO/countryOutputDTO.js"
import { MESSAGES } from "../utils/responseMessages.js"

class CountryController {
  async create(req, res) {
    logger.info("POST: /api/countries")
    try {
      const { name, zone } = req.body
      const countryInputDTO = new CountryInputDTO(name, zone)
      const country = await countryInputDTO.toCountry()

      await CountryService.save(country)
      res.status(201).json({
        message: MESSAGES.COUNTRY_CREATED,
        data: country,
      })
    } catch (err) {
      logger.error("CountryController - Error creating country - ", err)

      if (err.name === "ValidationError") {
        let errorMessage = `${MESSAGES.VALIDATION_ERROR}: `
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ message: errorMessage.trim(), error: err })
      } else if (err.code === 11000) {
        res.status(400).json({
          message: MESSAGES.DUPLICATE_COUNTRY,
          error: err,
        })
      } else if (err.message === "InvalidCountryName") {
        res.status(400).json({
          error: MESSAGES.INVALID_COUNTRY_NAME,
        })
      } else if (err.message === "ZoneNotFound") {
        res.status(400).json({
          error: MESSAGES.ZONE_NOT_FOUND,
        })
      } else {
        res.status(500).json({
          message: MESSAGES.FAILED_TO_CREATE_COUNTRY,
          error: err.message,
        })
      }
    }
  }

  async getAll(req, res) {
    logger.info("GET: /api/countries")

    try {
      const countriesFound = await CountryService.list()
      const countries = CountryOutputDTO.fromCountry(countriesFound)
      res.status(200).json({
        message: MESSAGES.COUNTRIES_RETRIEVED,
        data: countries,
      })
    } catch (err) {
      logger.error("CountryController - Error retrieving countries - ", err)
      res.status(500).json({
        message: MESSAGES.FAILED_TO_RETRIEVE_COUNTRIES,
        error: err,
      })
    }
  }

  async getByCode(req, res) {
    const { cc } = req.params
    logger.info(`GET: /api/countries/cc/${cc}`)
    try {
      const countryFound = await CountryService.list({ cc })
      const country = CountryOutputDTO.fromCountry(countryFound)

      res.status(200).json({
        message: MESSAGES.COUNTRY_RETRIEVED_BY_CODE,
        data: country,
      })
    } catch (err) {
      logger.error(
        "CountryController - Error retrieving country by code - ",
        err
      )

      if (err.message === "CountryNotFound") {
        res.status(404).json({ error: MESSAGES.COUNTRY_NOT_FOUND })
      } else {
        res.status(500).json({
          message: MESSAGES.FAILED_TO_RETRIEVE_COUNTRY_BY_CODE,
          error: err,
        })
      }
    }
  }

  async getByName(req, res) {
    const { name: countryName } = req.params
    logger.info(`GET: /api/countries/name/${countryName}`)
    try {
      const countryFound = await CountryService.list({
        name: countryName,
      })
      const country = CountryOutputDTO.fromCountry(countryFound)
      res.status(200).json({
        message: MESSAGES.COUNTRY_RETRIEVED_BY_NAME,
        data: country,
      })
    } catch (err) {
      logger.error(
        "CountryController - Error retrieving country by name - ",
        err
      )
      res.status(500).json({
        message: MESSAGES.FAILED_TO_RETRIEVE_COUNTRY_BY_NAME,
        error: err,
      })
    }
  }

  async update(req, res) {
    const { cc } = req.params
    logger.info(`PUT: /api/countries/${cc}`)

    try {
      const { name, zone } = req.body
      const updatedCountry = await CountryService.update(cc, name, zone)
      const updatedCountryDTO = CountryOutputDTO.fromCountry([updatedCountry])

      res.status(200).json({
        message: MESSAGES.COUNTRY_UPDATED,
        data: updatedCountryDTO,
      })
    } catch (err) {
      if (err.message === "CountryNotFound") {
        res.status(404).json({ error: MESSAGES.COUNTRY_NOT_FOUND })
      } else if (err.message === "ZoneNotFound") {
        res.status(400).json({ error: MESSAGES.ZONE_NOT_FOUND })
      } else {
        logger.error("CountryController - Error updating country - ", err)
        res.status(400).json({
          message: MESSAGES.FAILED_TO_UPDATE_COUNTRY,
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
        message: MESSAGES.COUNTRY_DELETED,
        data: deletedCountry,
      })
    } catch (err) {
      logger.error("CountryController - Error deleting country - ", err)

      if (err.message === "CountryNotFound") {
        res.status(404).json({ error: MESSAGES.COUNTRY_NOT_FOUND })
      } else {
        res.status(500).json({
          message: MESSAGES.FAILED_TO_DELETE_COUNTRY,
          error: err,
        })
      }
    }
  }
}

export default new CountryController()
