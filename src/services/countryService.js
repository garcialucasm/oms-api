import logger from "../logger.js"
import Country from "../models/countryModel.js"
import Zone from "../models/zoneModel.js"
import { getCountryIso2 } from "../utils/countriesData.js"

class CountryService {
  async save(data) {
    logger.debug("CountryService - save")
    const zone = await Zone.findOne({ cz: data.zone })

    if (!zone) {
      throw new Error("ZoneNotFound")
    }

    data.zone = zone._id
    const countryISOCode = getCountryIso2(data.name)
    if (!countryISOCode) {
      throw new Error("InvalidCountryName")
    }

    data.cc = countryISOCode
    const country = new Country(data)

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
