import OutbreakService from "../services/outbreakService.js"
import logger from "../logger.js"
import OutbreakInputDTO from "../DTO/outbreakInputDTO.js"
import OutbreakOutputDTO from "../DTO/outbreakOutputDTO.js"
import { MESSAGES } from "../utils/responseMessages.js"

class OutbreakController {
  async create(req, res) {
    logger.info("POST: /api/outbreaks")
    try {
      const inputDTO = new OutbreakInputDTO(req.body)
      const outbreakModel = await inputDTO.toOutbreak()
      const savedOutbreak = await OutbreakService.create(outbreakModel)
      const outputDTO = new OutbreakOutputDTO(savedOutbreak)
      res
        .status(201)
        .json({ message: MESSAGES.OUTBREAK_CREATED, data: outputDTO })
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        return res.status(400).json({ error: errorMessage.trim() })
      }
      if (err.message === "MissingRequiredFields") {
        return res.status(404).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS })
      }
      if (err.message === "VirusNotFound") {
        return res.status(404).json({ error: MESSAGES.VIRUS_NOT_FOUND_BY_CODE })
      }
      if (err.message === "ZoneNotFound") {
        return res.status(404).json({ error: MESSAGES.ZONE_NOT_FOUND_BY_CODE })
      }
      if (err.message === "OutbreakAlreadyExists") {
        return res.status(400).json({ error: MESSAGES.OUTBREAK_ALREADY_EXISTS })
      }
      if (err.message === "InvalidStartDateFormat") {
        return res
          .status(400)
          .json({ error: MESSAGES.INVALID_STARTDATE_FORMAT })
      }
      if (err.message === "InvalidEndDateFormat") {
        return res.status(400).json({ error: MESSAGES.INVALID_ENDDATE_FORMAT })
      }
      if (err.message === "FutureStartDate") {
        return res.status(400).json({ error: MESSAGES.FUTURE_STARTDATE })
      }
      if (err.message === "EndDateBeforeStartDate") {
        return res
          .status(400)
          .json({ error: MESSAGES.ENDDATE_BEFORE_STARTDATE })
      }
      if (err.message === "FutureEndDate") {
        return res.status(400).json({ error: MESSAGES.FUTURE_ENDDATE })
      } else if (err.code === 11000) {
        return res.status(400).json({
          error: MESSAGES.DUPLICATE_OUTBREAK,
        })
      } else {
      return res.status(500).json({ error: MESSAGES.FAILED_TO_CREATE_OUTBREAK })
    }}
  }

  async getAll(req, res) {
    logger.info("GET: /api/outbreaks")
    try {
      const outbreaks = await OutbreakService.getAll()
      const outputDTOs = outbreaks.map(
        (outbreak) => new OutbreakOutputDTO(outbreak)
      )
      res
        .status(200)
        .json({ message: MESSAGES.OUTBREAKS_RETRIEVED, data: outputDTOs })
    } catch (error) {
      if (error.message === "OutbreakNotFound") {
        return res.status(404).json({ error: MESSAGES.NO_OUTBREAKS_FOUND })
      }
      return res
        .status(500)
        .json({ error: MESSAGES.FAILED_TO_RETRIEVE_OUTBREAKS })
    }
  }

  async getByCode(req, res) {
    logger.info(`GET: /api/outbreaks by Code: ${req.params.co}`)
    try {
      const outbreaks = await OutbreakService.listByOutbreak(req.params.co)
      const outputDTOs = new OutbreakOutputDTO(outbreaks)
      return res
        .status(200)
        .json({
          message: MESSAGES.OUTBREAK_RETRIEVED_BY_CODE,
          data: outputDTOs,
        })
    } catch (error) {
      if (error.message === "OutbreakNotFound") {
        return res
          .status(404)
          .json({ error: MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE })
      } else {
      return res
        .status(500)
        .json({ error: MESSAGES.FAILED_TO_RETRIEVE_OUTBREAK_BY_CODE })
    }}
  }

  async getByVirusCode(req, res) {
    logger.info(`GET: /api/outbreaks by Virus Code: ${req.params.cv}`)
    try {
      const outbreaks = await OutbreakService.listByVirus(req.params.cv)
      const outputDTOs = outbreaks.map(
        (outbreak) => new OutbreakOutputDTO(outbreak)
      )
      res
        .status(200)
        .json({ message: MESSAGES.OUTBREAKS_RETRIEVED, data: outputDTOs })
    } catch (error) {
      if (error.message === "OutbreakNotFound") {
        return res.status(404).json({ error: MESSAGES.NO_OUTBREAKS_FOUND })
      }
      if (error.message === "VirusNotFound") {
        return res.status(404).json({ error: MESSAGES.VIRUS_NOT_FOUND_BY_CODE })
      }
      return res
        .status(500)
        .json({ error: MESSAGES.FAILED_TO_RETRIEVE_OUTBREAKS })
    }
  }

  async getByZoneCode(req, res) {
    logger.info(`GET: /api/outbreaks by Zone Code: ${req.params.cz}`)
    try {
      const outbreaks = await OutbreakService.listByZone(req.params.cz)
      const outputDTOs = outbreaks.map(
        (outbreak) => new OutbreakOutputDTO(outbreak)
      )
      res
        .status(200)
        .json({ message: MESSAGES.OUTBREAKS_RETRIEVED, data: outputDTOs })
    } catch (error) {
      if (error.message === "OutbreakNotFound") {
        return res.status(404).json({ error: MESSAGES.NO_OUTBREAKS_FOUND })
      }
      if (error.message === "ZoneNotFound") {
        return res.status(404).json({ error: MESSAGES.ZONE_NOT_FOUND_BY_CODE })
      }
      return res
        .status(500)
        .json({ error: MESSAGES.FAILED_TO_RETRIEVE_OUTBREAKS })
    }
  }


  async getAllByCondition(req, res) {
    logger.info(`GET: /api/outbreaks by Condition: ${req.params.condition}`)
    try {
      const outbreaks = await OutbreakService.listActOcc(req.params.condition)
      const outputDTOs = outbreaks.map(
        (outbreak) => new OutbreakOutputDTO(outbreak)
      )
      res
        .status(200)
        .json({ message: MESSAGES.OUTBREAKS_RETRIEVED, data: outputDTOs })
    } catch (error) {
      if (error.message === "OutbreakNotFound") {
        return res.status(404).json({ error: MESSAGES.NO_OUTBREAKS_FOUND })
      }
      if (error.message === "InvalidParameters") {
        return res.status(404).json({ error: MESSAGES.TRY_ACTIVE_OR_OCCURRED })
      }
      return res
        .status(500)
        .json({ error: MESSAGES.FAILED_TO_RETRIEVE_OUTBREAKS })
    }
  }

  async update(req, res) {
    logger.info(`PUT: /api/outbreaks by Code: ${req.params.co}`)
    try {
      const inputDTO = new OutbreakInputDTO(req.body)
      const outbreakModel = await inputDTO.toOutbreak()
      const outbreak = await OutbreakService.update(
        req.params.co,
        outbreakModel
      )
      const outputDTO = new OutbreakOutputDTO(outbreak)
      res
        .status(200)
        .json({ message: MESSAGES.OUTBREAK_UPDATED, data: outputDTO })
    } catch (error) {
      if (error.message === "OutbreakNotFound") {
        return res
          .status(404)
          .json({ error: MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE })
      }
      if (error.message === "MissingRequiredFields") {
        return res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS })
      }
      if (error.message === "VirusNotFound") {
        return res.status(404).json({ error: MESSAGES.VIRUS_NOT_FOUND_BY_CODE })
      }
      if (error.message === "ZoneNotFound") {
        return res.status(404).json({ error: MESSAGES.ZONE_NOT_FOUND_BY_CODE })
      }
      if (error.message === "OutbreakAlreadyExists") {
        return res.status(400).json({ error: MESSAGES.OUTBREAK_ALREADY_EXISTS })
      }
      if (error.message === "InvalidStartDateFormat") {
        return res
          .status(400)
          .json({ error: MESSAGES.INVALID_STARTDATE_FORMAT })
      }
      if (error.message === "InvalidEndDateFormat") {
        return res.status(400).json({ error: MESSAGES.INVALID_ENDDATE_FORMAT })
      }
      if (error.message === "FutureStartDate") {
        return res.status(400).json({ error: MESSAGES.FUTURE_STARTDATE })
      }
      if (error.message === "EndDateBeforeStartDate") {
        return res
          .status(400)
          .json({ error: MESSAGES.ENDDATE_BEFORE_STARTDATE })
      }
      if (error.message === "FutureEndDate") {
        return res.status(400).json({ error: MESSAGES.FUTURE_ENDDATE })
      } else {
        return res
          .status(500)
          .json({ error: MESSAGES.FAILED_TO_UPDATE_OUTBREAK })
      }
    }
  }

  async updateByZoneCodeVirusCode(req, res) {
    logger.info(
      `PUT: /api/outbreaks by Zone Code: ${req.params.cz} and Virus Code: ${req.params.cv}`
    )
    try {
      const inputDTO = new OutbreakInputDTO(req.body)
      const outbreakModel = await inputDTO.toOutbreak()
      const outbreak = await OutbreakService.updateByZoneCodeVirusCode(
        req.params.cz,
        req.params.cv,
        outbreakModel
      )
      const outputDTO = new OutbreakOutputDTO(outbreak)
      res
        .status(200)
        .json({ message: "Outbreak updated successfully", data: outputDTO })
    } catch (error) {
      if (error.message === "OutbreakSearchedNotFound") {
        return res
          .status(404)
          .json({ error: MESSAGES.OUTBREAK_SEARCHED_NOT_FOUND })
      }
      if (error.message === "MissingRequiredFields") {
        return res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS })
      }
      if (error.message === "VirusNotFound") {
        return res.status(404).json({ error: MESSAGES.VIRUS_NOT_FOUND_BY_CODE })
      }
      if (error.message === "VirusSearchedNotFound") {
        return res
          .status(404)
          .json({ error: MESSAGES.VIRUS_SEARCHED_NOT_FOUND })
      }
      if (error.message === "ZoneNotFound") {
        return res.status(404).json({ error: MESSAGES.ZONE_NOT_FOUND_BY_CODE })
      }
      if (error.message === "ZoneSearchedNotFound") {
        return res.status(404).json({ error: MESSAGES.ZONE_SEARCHED_NOT_FOUND })
      }
      if (error.message === "OutbreakAlreadyExists") {
        return res.status(400).json({ error: MESSAGES.OUTBREAK_ALREADY_EXISTS })
      }
      if (error.message === "InvalidStartDateFormat") {
        return res
          .status(400)
          .json({ error: MESSAGES.INVALID_STARTDATE_FORMAT })
      }
      if (error.message === "InvalidEndDateFormat") {
        return res.status(400).json({ error: MESSAGES.INVALID_ENDDATE_FORMAT })
      }
      if (error.message === "FutureStartDate") {
        return res.status(400).json({ error: MESSAGES.FUTURE_STARTDATE })
      }
      if (error.message === "EndDateBeforeStartDate") {
        return res
          .status(400)
          .json({ error: MESSAGES.ENDDATE_BEFORE_STARTDATE })
      }
      if (error.message === "FutureEndDate") {
        return res.status(400).json({ error: MESSAGES.FUTURE_ENDDATE })
      } else {
        return res
          .status(500)
          .json({ error: MESSAGES.FAILED_TO_UPDATE_OUTBREAK })
      }
    }
  }

  async delete(req, res) {
    logger.info(`DELETE: /api/outbreaks by Code: ${req.params.co}`)
    try {
      await OutbreakService.delete(req.params.co)
      res.status(200).json({ message: MESSAGES.OUTBREAK_DELETED })
    } catch (error) {
      if (error.message === "OutbreakNotFound") {
        return res
          .status(404)
          .json({ error: MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE })
      }
      if (error.message === "GuidelineAssociated") {
        return res
          .status(400)
          .json({ error: MESSAGES.CANNOT_DELETE_GUIDELINES_ASSOCIATED })
      }
      return res.status(500).json({ error: MESSAGES.FAILED_TO_DELETE_OUTBREAK })
    }
  }
}

export default new OutbreakController()
