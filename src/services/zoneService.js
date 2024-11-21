import Zone from "../models/zoneModel.js"
import Outbreak from "../models/outbreakModel.js"

class ZoneService {
  async save(data) {
    const zone = new Zone(data)
    await zone.save()
    return zone
  }
  async list() {
    const zones = await Zone.find().populate("countries")
    if (!zones) {
      throw new Error("ZoneNotFound")
    }
    return zones
  }
  async listByName(name) {
    const zone = await Zone.findOne({ name: name }).populate("countries")
    if (!zone) {
      throw new Error("ZoneNotFound")
    }
    return zone
  }
  async listByCode(cz) {
    const zone = await Zone.findOne({ cz: cz }).populate("countries")
    if (!zone) {
      throw new Error("ZoneNotFound")
    }
    return zone
  }
  async editByCode(cz, data) {
    const zone = await Zone.findOne({ cz: cz }).populate("countries")
    if (!zone) {
      throw new Error("ZoneNotFound")
    }
    Object.assign(zone, data)
    await zone.save()
    return zone
  }
  async removeByCode(cz) {
    const zone = await Zone.findOne({ cz: cz }).populate("countries")
    
    if (!zone) {
      throw new Error("ZoneNotFound")
    }
    if(zone.countries.length !== 0) {
      throw new Error("CountryAssociated")
    }
    const outbreak = await Outbreak.findOne({zone: zone._id})
    console.log("🚀 ~ ZoneService ~ removeByCode ~ outbreak:", outbreak)

    if(outbreak) {
      throw new Error("OutbreakAssociated")
    }
    await zone.deleteOne()
  }
}

export default new ZoneService()
