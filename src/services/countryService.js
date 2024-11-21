import logger from "../logger.js"
import Country from "../models/countryModel.js"

class CountryService {
  async save(data) {
    logger.debug("CountryService - save")

    const country = new Country(data)

    await country.save()
  }

  async list(data) {
    logger.debug("CountryService - list")

    const countries = await Country.find(data ?? data).exec()

    if (countries.length === 0) {
      const error = new Error()
      error.code = "NOT_FOUND"
      error.message = "Country Not Found"

      logger.error("CountryService - list - ", error.message)
      throw error
    }

    return countries
  }

  async update(cc, data) {
    logger.debug("CountryService - update")

    const country = await Country.findOne({ cc }).exec()

    if (country.length === 0) {
      const error = new Error()
      error.code = "NOT_FOUND"
      error.message = "Country Not Found"

      logger.error("CountryService - update - ", error.message)
      throw error
    }

    Object.assign(country, data)
    return await country.save()
  }

  async delete(cc) {
    logger.debug("CountryService - delete")

    const country = await Country.findOne({ cc }).exec()

    if (!country) {
      const error = new Error()
      error.code = "NOT_FOUND"
      error.message = "Country Not Found"

      logger.error("CountryService - delete - ", error.message)
      throw error
    }

    await country.deleteOne()
  }
}

export default new CountryService()
