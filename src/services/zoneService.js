import Zone from "../models/zoneModel.js"

class ZoneService {
  async save(data) {
    const zone = new Zone(data)
    await zone.save()
  }
  async list() {
    return await Zone.find()
  }
  async listByName(name) {
    return await Zone.findOne({ name: name })
  }
  async listByCode(cz) {
    return await Zone.findOne({ cz: cz })
  }
  async editByCode(cz, data) {
    const zone = await Zone.findOne({ cz: cz })
    if (!zone) {
      const error = new Error()
      error.statusCode = 400
      throw error
    }
    Object.assign(zone, data)
    await zone.save()
    return zone
  }
  async removeByCode(cz) {
    const zone = await Zone.findOne({ cz: cz }).exec()
    if (!zone) {
      const error = new Error()
      error.statusCode = 400
      throw error
    }
    await zone.deleteOne()
  }
}

export default new ZoneService()
