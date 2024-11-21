import Zone from "../models/zoneModel.js"

class ZoneService {
  async save(data) {
    const zone = new Zone(data)
    await zone.save()
    return zone
  }
  async list() {
    const zones = await Zone.find()
    if(!zones) {
      throw new Error("ZoneNotFound")
    }
    return zones
  }
  async listByName(name) {
    const zone = await Zone.findOne({ name: name })
    if(!zone) {
      throw new Error("ZoneNotFound")
    }
    return zone
  }
  async listByCode(cz) {
    const zone = await Zone.findOne({ cz: cz })
    if(!zone) {
      throw new Error("ZoneNotFound")
    }
    return zone
  }
  async editByCode(cz, data) {
    const zone = await Zone.findOne({ cz: cz })
    if (!zone) {
      throw new Error("ZoneNotFound")
    }
    Object.assign(zone, data)
    await zone.save()
    return zone
  }
  async removeByCode(cz) {
    const zone = await Zone.findOne({ cz: cz }).exec()
    if (!zone) {
      throw new Error("ZoneNotFound")
    }
    await zone.deleteOne()
  }
}

export default new ZoneService()
