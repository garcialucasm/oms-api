import Outbreak from "../models/outbreakModel.js"
import Virus from "../models/virusModel.js"
import Zone from "../models/zoneModel.js"

class OutbreakInputDTO {
  constructor({ co, virus, zone, startDate, endDate, condition }) {
    if (!co || !virus || !zone || !startDate) {
      throw new Error("MissingRequiredFields")
    }

    this.co = co
    this.virus = virus
    this.zone = zone
    this.startDate = new Date(startDate)
    this.endDate = endDate ? new Date(endDate) : null
    this.condition = condition || (this.endDate ? "occurred" : "active")

    if (isNaN(this.startDate.getTime())) {
      throw new Error("InvalidStartDateFormat")
    }

    if (this.startDate > Date.now()) {
      throw new Error("FutureStartDate")
    }

    if (this.endDate && isNaN(this.endDate.getTime())) {
      throw new Error("InvalidEndDateFormat")
    }

    if (this.endDate && this.endDate < this.startDate) {
      throw new Error("EndDateBeforeStartDate")
    }

    if (this.endDate && this.endDate > Date.now()) {
      throw new Error("FutureEndDate")
    }

    if (this.condition !== "active" && this.condition !== "occurred") {
      throw new Error("InvalidParameters")
    }
  }

  async toOutbreak() {
    const virusDocument = await Virus.findOne({ cv: this.virus })
    if (!virusDocument) {
      throw new Error("VirusNotFound")
    }

    const zoneDocument = await Zone.findOne({ cz: this.zone })
    if (!zoneDocument) {
      throw new Error("ZoneNotFound")
    }

    return new Outbreak({
      co: this.co,
      virus: virusDocument._id,
      zone: zoneDocument._id,
      startDate: this.startDate,
      endDate: this.endDate,
      condition: this.condition,
    })
  }
}

export default OutbreakInputDTO
