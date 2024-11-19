import Guideline from "../models/guidelineModel.js"
import Outbreak from "../models/outbreakModel.js"

class GuidelineInputDTO {
  constructor(cg, outbreak, validityPeriod) {
    this.cg = cg
    this.outbreak = co
    this.validityPeriod = validityPeriod
  }

  async toGuideline() {
    const guidelineOutbreak = await Outbreak.findOne({ co: this.outbreak })

    if (!outbreakOutbreak) {
      const error = new Error("Outbreak not found")
      error.name = "OubreakNotFound"
      throw error
    }

    return new Guideline({
      cg: this.cg,
      outbreak: guidelineOutbreak._id,
      validityPeriod: this.validityPeriod,
    })
  }
}

export default GuidelineInputDTO
