import Outbreak from "../models/outbreakModel.js"
import Virus from "../models/virusModel.js"
import Zone from "../models/zoneModel.js"

class OutbreakInputDTO {
  constructor(co, virus, zone, startDate, endDate, condition) {
    this.co = co
    this.virus = virus
    this.zone = zone
    this.startDate = startDate
    this.endDate = endDate
    this.condition = condition
  }

  async toOutbreak() {
    const outbreakVirus = await Virus.findOne({ cv: this.virus })
    const outbreakZone = await Zone.findOne({ cz: this.zone })

    if (!outbreakVirus) {
      const error = new Error("Virus not found")
      error.name = "VirusNotFound"
      throw error
    }
    if (!outbreakZone) {
      const error = new Error("Zone not found")
      error.name = "ZoneNotFound"
      throw error
    }

    return new Outbreak({
      co: this.co,
      virus: outbreakVirus._id,
      zone: outbreakZone._id,
      startDate: this.startDate,
      endDate: this.endDate,
      condition: this.condition,
    })
  }
}

export default OutbreakInputDTO
