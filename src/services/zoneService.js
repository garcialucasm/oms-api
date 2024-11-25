import Zone from "../models/zoneModel.js"
import Outbreak from "../models/outbreakModel.js"

class ZoneService {
  async save(zoneModel) {
    return zoneModel.save()
  }
  async list() {
    const zones = await Zone.find().populate({path: "countries", select: "cc name -_id -zone"})
    if (!zones) {
      throw new Error("ZoneNotFound")
    }
    return zones
  }
  async listByName(name) {
    const zone = await Zone.findOne({ name: name }).populate({path: "countries", select: "cc name -_id -zone"})
    if (!zone) {
      throw new Error("ZoneNotFound")
    }
    return zone
  }
  async listByCode(cz) {
    const zone = await Zone.findOne({ cz: cz }).populate({path: "countries", select: "cc name -_id -zone"})
    if (!zone) {
      throw new Error("ZoneNotFound")
    }
    return zone
  }
  async editByCode(cz, zoneModel) {
    const zone = await Zone.findOne({ cz: cz }).populate({path: "countries", select: "cc name -_id -zone"})
    if (!zone) {
      throw new Error("ZoneNotFound")
    }
    zone.cz = zoneModel.cz || zone.cz
    zone.name = zoneModel.name || zone.name
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

    if(outbreak) {
      throw new Error("OutbreakAssociated")
    }
    await zone.deleteOne()
  }
}

export default new ZoneService()
