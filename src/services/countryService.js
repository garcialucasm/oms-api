import logger from "../logger.js"
import Country from "../models/countryModel.js"

class CountryService {
  async save(country) {
    logger.debug("CountryService - save")

    await country.save()
  }

  async list(data) {
    logger.debug("CountryService - list")

    const countries = await Country.find(data ?? data).populate({
      path: "zone",
      select: "cz name -_id",
    })

    if (countries.length === 0) {
      throw new Error("CountryNotFound")
    }

    return countries
  }

  async update(cc, data) {
    logger.debug("CountryService - update")

    const country = await Country.findOne({ cc }).exec()

    if (country.length === 0) {
      throw new Error("CountryNotFound")
    }

    Object.assign(country, data)
    return await country.save()
  }

  async delete(cc) {
    logger.debug("CountryService - delete")

    const country = await Country.findOne({ cc }).exec()

    if (!country) {
      throw new Error("CountryNotFound")
    }

    await country.deleteOne()
  }
}

export default new CountryService()
