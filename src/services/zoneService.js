import Zone from "../models/zoneModel.js";

class ZoneService {
  async save(data) {
    const zone = new Zone(data);
    await zone.save();
  }
  async list() {
    return await Zone.find();
  }
  async listByName(name) {
    return await Zone.findOne({ name: name }).exec();
  }
  async listByCode(cz) {
    return await Zone.findOne({ cz: cz }).exec();
  }
  async editByCode(cz, data) {
    const zone = await Zone.findOne({ cz: cz });
    if (!zone) {
      throw new Error("Zone not found");
    }
    Object.assign(zone, data);
    await zone.save();
  }
  async removeByCode(cz) {
    const zone = await Zone.findOne({ cz: cz }).exec();
    if (!zone) {
      throw new Error("Zone not found");
    }
    await zone.deleteOne();
  }
}

export default new ZoneService();
