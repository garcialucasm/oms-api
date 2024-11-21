import GuidelineService from "../services/guidelineService.js"
import logger from "../logger.js"
class GuidelineController {
  async createGuideline(req, res) {
    logger.info("POST: /api/guidelines")
    try {
      const { cg, outbreak, validityPeriod } = req.body
      const guideline = await GuidelineService.save({
        cg,
        outbreak,
        validityPeriod,
      })
      res.status(201).json({ message: "Guideline created", data: guideline })
    } catch (err) {
      logger.error("GuidelineController - Error creating guideline")
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.message === "OutbreakNotFound") {
        res.status(400).json({
          error: "No outbreaks with the given outbreak code",
        })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: "Duplicate guideline code. Please use unique values.",
        })
      } else {
        res.status(500).json({ error: "Error saving guideline" })
      }
    }
  }

  async getAllGuidelines(req, res) {
    logger.info("GET:/api/guidelines")
    try {
      const guidelines = await GuidelineService.list()
      res.status(200).json({ message: "Guidelines found", data: guidelines })
    } catch (err) {
      logger.error("GuidelineController - Failed to retrieve guidelines", err)
      if (err.message === "GuidelineNotFound") {
        res.status(404).json({ error: "No guidelines found" })
      } else {
        res.status(500).json({ error: "Error retrieving Guidelines" })
      }
    }
  }

  async getGuidelinesByCode(req, res) {
    logger.info("GET:/api/guidelines by Code: " + req.params.cg)
    try {
      const guideline = await GuidelineService.listByCode(req.params.cg)
      res.status(200).json({ message: "Guideline found", data: guideline })
    } catch (err) {
      logger.error("GuidelineController - Failed to retrieve guideline by code")
      if (err.message === "GuidelineNotFound") {
        res.status(404).json({ error: "No guidelines match the given code" })
      } else {
        res.status(500).json({ error: "Error retrieving Guideline" })
      }
    }
  }

  async getGuidelinesByStatus(req, res) {
    logger.info("GET:/api/guidelines by Status: " + req.params.status)
    try {
      const guideline = await GuidelineService.listByStatus(req.params.status)
      res.status(200).json({ message: "Guideline found", data: guideline })
    } catch (err) {
      logger.error(
        "GuidelineController - Failed to retrieve guideline by status"
      )
      if (err.message === "InvalidStatus") {
        res
          .status(400)
          .json({ error: "Invalid search parameter. Try true or false" })
      } else if (err.message === "GuidelineNotFound") {
        res.status(404).json({ error: "No guidelines match the given status" })
      } else {
        res.status(500).json({ error: "Error retrieving Guideline" })
      }
    }
  }

  async updateGuidelineByCode(req, res) {
    logger.info("PUT: /api/guidelines")
    try {
      const { cg, outbreak, validityPeriod } = req.body
      const guideline = await GuidelineService.editByCode(req.params.cg, {
        cg,
        outbreak,
        validityPeriod,
      })
      res.status(201).json({ message: "Guideline updated", data: guideline })
    } catch (err) {
      logger.error("GuidelineController - Error updating guideline")
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error:"
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ message: errorMessage.trim() })
      } else if(err.message === "MissingFields") {
        res.status(400).json({error: "Missing required fields. Possible fields for update: cg, outbreak and/or validityPeriod"})
      } else if (err.message === "GuidelineNotFound") {
        res
          .status(400)
          .json({ error: "Guideline not found with the given guideline code" })
      } else if (err.message === "OutbreakNotFound") {
        res
          .status(400)
          .json({ error: "Outbreak not found with the given outbreak code" })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: "Duplicate guideline code. Please use unique values.",
        })
      } else {
        res.status(500).json({ error: "Error updating guideline" })
      }
    }
  }

  async deleteExpiredGuidelineByCode(req, res) {
    logger.info("DELETE:/api/expired guideline: " + req.params.cg)
    try {
      await GuidelineService.removeExpiredByCode(req.params.cg)
      res.status(200).json({ message: "Guideline deleted", data: req.params.cg })
    } catch (err) {
      logger.error("GuidelineController - Error deleting guideline")
      if (err.message === "GuidelineNotFound") {
        res
          .status(400)
          .json({ error: "Guideline not found with the given code" })
      } else if (err.message === "NotExpired") {
        res
          .status(400)
          .json({ error: "Cannot delete guideline if not expired" })
      } else {
        res.status(500).json({ error: "Error deleting Guideline" })
      }
    }
  }

  async deleteGuidelineByCode(req, res) {
    logger.info("DELETE:/api/guidelines: " + req.params.cg)
    try {
      await GuidelineService.removeByCode(req.params.cg)
      res.status(200).json({ message: "Guideline deleted", data: req.params.cg })
    } catch (err) {
      logger.error("GuidelineController - Error deleting guideline")
      if (err.message === "GuidelineNotFound") {
        res
          .status(400)
          .json({ error: "Guideline not found with the given code" })
      } else {
        res.status(500).json({ error: "Error deleting Guideline" })
      }
    }
  }
}

export default new GuidelineController()
