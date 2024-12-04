import Zone from "../models/zoneModel.js"
import Country from "../models/countryModel.js"
import { getCountryIso2 } from "../utils/countriesData.js"

class CountryInputDTO {
  constructor(name, zone) {
    this.name = name
    this.zone = zone
  }

  async toCountry() {
    const zone = await Zone.findOne({ cz: this.zone })
    if (!zone) {
      throw new Error("ZoneNotFound")
    }

    const countryISOCode = getCountryIso2(this.name)
    if (!countryISOCode || !this.name) {
      throw new Error("InvalidCountryName")
    }

    this.zone = zone._id?.toString()
    this.cc = countryISOCode

    return new Country({
      cc: countryISOCode,
      name: this.name,
      zone: this.zone,
    })
  }
}

export default CountryInputDTO
