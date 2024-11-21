import Guideline from "../models/guidelineModel.js"
import GuidelineInputDTO from "../DTO/guidelineInputDTO.js"
import Outbreak from "../models/outbreakModel.js"
import Zone from "../models/zoneModel.js"

class GuidelineService {
  async save({ cg, outbreak, validityPeriod }) {
    const guidelineInputDTO = new GuidelineInputDTO(
      cg,
      outbreak,
      validityPeriod
    )
    const guideline = await guidelineInputDTO.toGuideline()
    await guideline.save()
  }
  async list() {
    return await Guideline.find().populate("outbreak")
  }
  async listByCode(cg) {
    return await Guideline.findOne({ cg: cg }).populate("outbreak")
  }
  async listByStatus(isExpired) {
    return await Guideline.findOne({ isExpired: isExpired }).populate(
      "outbreak"
    )
  }
  /* async listByCountryAndOutbreak(co) {
    const guidelineComplete = await Guideline.find({}).populate({
      path: "outbreak",
      populate: { path: "cz" },
    })
    const guidelinesByCO = guidelineComplete.filter(
      (guideline) => guideline.outbreak.co === co
    )
    const guidelinesByCC = guidelinesByCO.filter(
      (guideline) => guideline.outbreak.cz.cz === cc
    )
    return guidelinesByCC
  } */
  async editByCode(code, data) {
    const { cg, outbreak, validityPeriod } = data

    const guideline = await Guideline.findOne({ cg: code })
    if (!guideline) {
      throw new Error("GuidelineNotFound")
    }

    const outbreakDoc = await Outbreak.findOne({ _id: outbreak })
    if (!outbreakDoc && outbreak !== undefined) {
      throw new Error("OutbreakNotFound")
    }

    guideline.cg = cg || guideline.cg
    guideline.outbreak = outbreakDoc?._id || guideline.outbreak
    guideline.validityPeriod = validityPeriod || guideline.validityPeriod

    await guideline.save()
    const populatedGuideline = await Guideline.findOne({outbreak: guideline.outbreak}).populate({path: "outbreak", populate: {path: "cz"}})

    return populatedGuideline
  }
  async removeByCode(cg) {
    const guideline = await Guideline.findOne({ cg: cg }).exec()
    if (!guideline) {
      const error = new Error()
      error.statusCode = 400
      error.message = "Outbreak not found"
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
