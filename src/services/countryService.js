import logger from "../logger.js"
import Country from "../models/countryModel.js"
import Zone from "../models/zoneModel.js"
import { getCountryIso2 } from "../utils/countriesData.js"

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

  async update(cc, name, zone) {
    logger.debug("CountryService - update")

    const newZone = await Zone.findOne({ cz: zone })
    if (!newZone) {
      throw new Error("ZoneNotFound")
    }

    const countryISOCode = getCountryIso2(name)
    if (!countryISOCode || !name) {
      throw new Error("InvalidCountryName")
    }

    const newZoneId = newZone._id?.toString()
    const newCc = countryISOCode

    const data = { cc: newCc, name: name, zone: newZoneId }

    const country = await Country.findOne({ cc })

    if (!country) {
      throw new Error("CountryNotFound")
    }

    Object.assign(country, data)
    return await country.save()
  }

  async delete(cc) {
    logger.debug("CountryService - delete")

    const country = await Country.findOne({ cc })

    if (!country) {
      throw new Error("CountryNotFound")
    }

    await country.deleteOne()
  }
}

export default new CountryService()
