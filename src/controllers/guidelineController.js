import GuidelineService from "../services/guidelineService.js"
import GuidelineInputDTO from "../DTO/guidelineInputDTO.js"
import GuidelineOutputDTO from "../DTO/guidelineOutputDTO.js"
import logger from "../logger.js"
import { MESSAGES } from "../utils/responseMessages.js"
class GuidelineController {
  async createGuideline(req, res) {
    logger.info("POST: /api/guidelines")
    try {
      const { cg, outbreak, validityPeriod } = req.body
      const inputDTO = new GuidelineInputDTO({ cg, outbreak, validityPeriod })
      const guidelineModel = await inputDTO.toGuideline()
      const savedGuideline = await GuidelineService.save(guidelineModel)
      const outputDTO = new GuidelineOutputDTO(savedGuideline)
      res.status(201).json({ message: MESSAGES.GUIDELINE_CREATED, data: outputDTO })
    } catch (err) {
      logger.error("GuidelineController - Error creating guideline")
      if (err.name === "ValidationError") {
        let errorMessage = `${MESSAGES.VALIDATION_ERROR}: `
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ message: errorMessage.trim(), error: err })
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS })
      } else if (err.message === "OutbreakNotFound") {
        res.status(400).json({
          error: MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE,
        })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_GUIDELINE,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_CREATE_GUIDELINE })
      }
    }
  }

  async getAllGuidelines(req, res) {
    logger.info("GET:/api/guidelines")
    try {
      const guidelines = await GuidelineService.list()
      const outputDTOs = guidelines.map((guideline) => new GuidelineOutputDTO(guideline))
      res.status(200).json({ message: MESSAGES.GUIDELINES_RETRIEVED, data: outputDTOs })
    } catch (err) {
      logger.error("GuidelineController - Failed to retrieve guidelines", err)
      if (err.message === "GuidelineNotFound") {
        res.status(404).json({ error: MESSAGES.NO_GUIDELINES_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_GUIDELINES })
      }
    }
  }

  async getGuidelinesByCode(req, res) {
    logger.info("GET:/api/guidelines by Code: " + req.params.cg)
    try {
      const guideline = await GuidelineService.listByCode(req.params.cg)
      const outputDTO = new GuidelineOutputDTO(guideline)
      res.status(200).json({ message: MESSAGES.GUIDELINE_RETRIEVED_BY_CODE, data: outputDTO })
    } catch (err) {
      logger.error("GuidelineController - Failed to retrieve guideline by code")
      if (err.message === "GuidelineNotFound") {
        res.status(404).json({ error: MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_GUIDELINE_BY_CODE })
      }
    }
  }

  async getGuidelinesByStatus(req, res) {
    logger.info("GET:/api/guidelines by Status: " + req.params.status)
    try {
      const guidelines = await GuidelineService.listByStatus(req.params.status)
      const outputDTOs = guidelines.map((guideline) => new GuidelineOutputDTO(guideline))
      res.status(200).json({ message: MESSAGES.GUIDELINES_RETRIEVED_BY_STATUS, data: outputDTOs })
    } catch (err) {
      logger.error(
        "GuidelineController - Failed to retrieve guidelines by status"
      )
      if (err.message === "InvalidStatus") {
        res
          .status(400)
          .json({ error: MESSAGES.INVALID_STATUS_PARAMETER })
      } else if (err.message === "GuidelineNotFound") {
        res.status(404).json({ error: MESSAGES.GUIDELINE_NOT_FOUND_BY_STATUS })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_GUIDELINES_BY_STATUS })
      }
    }
  }

  async updateGuidelineByCode(req, res) {
    logger.info("PUT: /api/guidelines")
    try {
      const { cg, outbreak, validityPeriod } = req.body
      const inputDTO = new GuidelineInputDTO({cg, outbreak, validityPeriod})
      const guideline = await GuidelineService.editByCode(req.params.cg, inputDTO)
      const outputDTO = new GuidelineOutputDTO(guideline)
      res.status(201).json({ message: MESSAGES.GUIDELINE_UPDATED, data: outputDTO })
    } catch (err) {
      logger.error("GuidelineController - Error updating guideline")
      if (err.name === "ValidationError") {
        let errorMessage = `${MESSAGES.VALIDATION_ERROR}: `
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ message: errorMessage.trim(), error: err })
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({
          error:
            MESSAGES.MISSING_REQUIRED_FIELDS
        })
      } else if (err.message === "GuidelineNotFound") {
        res
          .status(400)
          .json({ error: MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE })
      } else if (err.message === "OutbreakNotFound") {
        res
          .status(400)
          .json({ error: MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_GUIDELINE,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_UPDATE_GUIDELINE })
      }
    }
  }

  async deleteExpiredGuidelineByCode(req, res) {
    logger.info("DELETE:/api/expired guideline: " + req.params.cg)
    try {
      await GuidelineService.removeExpiredByCode(req.params.cg)
      res
        .status(200)
        .json({ message: MESSAGES.GUIDELINE_DELETED, data: req.params.cg })
    } catch (err) {
      logger.error("GuidelineController - Error deleting guideline")
      if (err.message === "GuidelineNotFound") {
        res
          .status(400)
          .json({ error: MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE })
      } else if (err.message === "NotExpired") {
        res
          .status(400)
          .json({ error: MESSAGES.GUIDELINE_NOT_EXPIRED })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_DELETE_GUIDELINE })
      }
    }
  }

  async deleteGuidelineByCode(req, res) {
    logger.info("DELETE:/api/guidelines: " + req.params.cg)
    try {
      await GuidelineService.removeByCode(req.params.cg)
      res
        .status(200)
        .json({ message: MESSAGES.GUIDELINE_DELETED, data: req.params.cg })
    } catch (err) {
      logger.error("GuidelineController - Error deleting guideline")
      if (err.message === "GuidelineNotFound") {
        res
          .status(400)
          .json({ error: MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_DELETE_GUIDELINE })
      }
    }
  }
}

export default new GuidelineController()
