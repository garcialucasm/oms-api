import Guideline from "../models/guidelineModel.js"
import Outbreak from "../models/outbreakModel.js"

class GuidelineService {
  async save(data, outbreak) {
    const outbreakDoc = await Outbreak.find({ outbreak: outbreak })
    if (!outbreakDoc) {
      const error = new Error()
      error.statusCode = 400
      throw error
    }
    const guideline = new Guideline(data)
    await guideline.save()
  }
  async list() {
    return await Guideline.find().populate("Outbreak")
  }
  async listByCode(cg) {
    return await Guideline.findOne({ cg: cg }).populate("Outbreak")
  }
  async listByStatus(isExpired) {
    return await Guideline.findOne({ isExpired: isExpired }).populate(
      "Outbreak"
    )
  }

  async editByCode(cg, outbreak, data) {
    const outbreakDoc = await Outbreak.find({ outbreak: outbreak })
    if (!outbreakDoc) {
      const error = new Error()
      error.statusCode = 400
      throw error
    }
    const guideline = await Guideline.findOne({ cg: cg })
    if (!guideline) {
      const error = new Error()
      error.statusCode = 400
      throw error
    }
    Object.assign(guideline, data)
    await guideline.save()
    return guideline.populate("Outbreak")
  }
  async removeByCode(cg) {
    const guideline = await Guideline.findOne({ cg: cg }).exec()
    if (!guideline) {
      const error = new Error()
      error.statusCode = 400
      throw error
    }
    await guideline.deleteOne()
  }
  async updateValidity() {
    try {
      const currentDate = new Date()

      const guidelines = await Guideline.find()

      for (const guideline of guidelines) {
        const expirationDate = new Date(
          guideline.guidelineDate.getTime() +
            guideline.validityPeriod * 24 * 60 * 60 * 1000
        )

        guideline.isExpired = expirationDate < currentDate ? true : false
        await guideline.save()
      }
      console.log("Validity updated successfully for all guidelines.")
    } catch (err) {
      console.error("Error updating validity:", err)
    }
  }
}

export default new GuidelineService()
