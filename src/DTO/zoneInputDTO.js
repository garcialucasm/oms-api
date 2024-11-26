import Zone from "../models/zoneModel.js"

class ZoneInputDTO {
  constructor({ cz, name }) {
    if (!cz || !name) {
      throw new Error("MissingRequiredFields")
    }
    this.cz = cz
    this.name = name
  }
  async toZone() {
    return new Zone({
      cz: this.cz,
      name: this.name,
    })
  }
}

export default ZoneInputDTO
