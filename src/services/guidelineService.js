import Guideline from "../models/guidelineModel.js"
import Outbreak from "../models/outbreakModel.js"

class GuidelineService {
  async save(guidelineModel) {
    await guidelineModel.save()
    return guidelineModel
  }
  async list() {
    const guidelines = await Guideline.find().populate({
      path: "outbreak",
      select: "co zone virus condition -_id",
    })
    if (guidelines.length === 0) {
      throw new Error("GuidelineNotFound")
    }
    return guidelines
  }
  async listByCode(cg) {
    const guideline = await Guideline.findOne({ cg: cg }).populate({
      path: "outbreak",
      select: "co zone virus condition -_id",
    })
    if (!guideline) {
      throw new Error("GuidelineNotFound")
    }
    return guideline
  }
  async listByStatus(isExpired) {
    if (isExpired != "true" && isExpired != "false") {
      throw new Error("InvalidStatus")
    }
    const guideline = await Guideline.findOne({
      isExpired: isExpired,
    }).populate({ path: "outbreak", select: "co zone virus condition -_id" })
    if (!guideline) {
      throw new Error("GuidelineNotFound")
    }
    return guideline
  }

  async editByCode(code, data) {
    const { cg, outbreak, validityPeriod } = data
    const guideline = await Guideline.findOne({ cg: code })
    if (!guideline) {
      throw new Error("GuidelineNotFound")
    }

    const outbreakDoc = await Outbreak.findOne({ co: outbreak })
    if (!outbreakDoc && outbreak !== undefined) {
      throw new Error("OutbreakNotFound")
    }

    guideline.cg = cg || guideline.cg
    guideline.outbreak = outbreakDoc?._id || guideline.outbreak
    guideline.validityPeriod = validityPeriod || guideline.validityPeriod

    await guideline.save()
    const populatedGuideline = await Guideline.findOne({
      cg: guideline.cg,
    }).populate({ path: "outbreak", select: "co zone virus condition -_id" })

    return populatedGuideline
  }
  async removeExpiredByCode(cg) {
    const guideline = await Guideline.findOne({ cg: cg }).exec()
    if (!guideline) {
      throw new Error("GuidelineNotFound")
    }
    if (guideline.isExpired == false) {
      throw new Error("NotExpired")
    }
    await guideline.deleteOne()
  }

  async removeByCode(cg) {
    const guideline = await Guideline.findOne({ cg: cg }).exec()
    if (!guideline) {
      throw new Error("GuidelineNotFound")
    }
    await guideline.deleteOne()
  }

  async updateValidity() {
    try {
      const currentDate = new Date()

      const guidelines = await Guideline.find()

      for (const guideline of guidelines) {
        const expirationDate = new Date(
          guideline.createdAt.getTime() +
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
