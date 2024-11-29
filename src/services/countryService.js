import logger from "../logger.js"
import Country from "../models/countryModel.js"
import Zone from "../models/zoneModel.js"
import Outbreak from "../models/outbreakModel.js"
import Guideline from "../models/guidelineModel.js"
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

  async listAllInfo(cc) {
    const country = await Country.findOne({ cc: cc }).populate("zone")
    if (!country) {
      throw new Error("CountryNotFound")
    }

    const outbreaks = await Outbreak.find({
      zone: country.zone._id,
    }).populate([{ path: "zone" }, { path: "virus" }])
    if (outbreaks.length === 0) {
      throw new Error("OutbreakNotFound")
    }
    const outbreakIds = outbreaks.map((outbreak) => outbreak._id)
    const guidelines = await Guideline.find({
      outbreak: { $in: outbreakIds },
    }).populate({
      path: "outbreak",
      populate: [{ path: "zone" }, { path: "virus" }],
    })

    if (guidelines.length === 0) {
      return outbreaks
    }

    const outbreaksWithGuidelines = guidelines.map((guideline) =>
      guideline.outbreak._id.toString()
    )
    const outbreaksWithoutGuidelines = outbreaks.filter(
      (outbreak) => !outbreaksWithGuidelines.includes(outbreak._id.toString())
    )

    const result = {
      guidelines,
      outbreaksWithoutGuidelines,
    }
    return result
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
