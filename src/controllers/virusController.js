import VirusService from "../services/virusService.js"
import logger from "../logger.js"
import VirusInputDTO from "../DTO/virusInputDTO.js"
import VirusOutputDTO from "../DTO/virusOutputDTO.js"
import { MESSAGES } from "../utils/responseMessages.js"
class VirusController {
  async create(req, res) {
    logger.info("POST: /api/viruses")
    try {
      const inputDTO = new VirusInputDTO(req.body)
      const virusModel = await inputDTO.toVirus()
      const savedVirus = await VirusService.create(virusModel)
      const outputDTO = new VirusOutputDTO(savedVirus)
      res.status(201).json({ message: MESSAGES.VIRUS_CREATED, data: outputDTO })
    } catch (err) {
      logger.error("VirusController - Error creating virus", err)
      if (err.message === "MissingRequiredFields") {
        res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_VIRUS,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_CREATE_VIRUS })
      }
    }
  }

  async getAll(req, res) {
    logger.info("GET: /api/viruses")
    try {
      const viruses = await VirusService.getAll()
      const outputDTOs = viruses.map((virus) => new VirusOutputDTO(virus))
      res
        .status(200)
        .json({ message: MESSAGES.VIRUSES_RETRIEVED, data: outputDTOs })
    } catch (err) {
      logger.error("VirusController - Error fetching all viruses", err)
      if (err.message === "VirusNotFound") {
        res.status(404).json({ error: MESSAGES.NO_VIRUSES_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_VIRUSES })
      }
    }
  }

  async getByName(req, res) {
    logger.info(`GET: /api/viruses by Name: ${req.params.name}`)
    try {
      const virus = await VirusService.getOne({ name: req.params.name })
      const outputDTO = new VirusOutputDTO(virus)
      res
        .status(200)
        .json({ message: MESSAGES.VIRUS_RETRIEVED_BY_NAME, data: outputDTO })
    } catch (err) {
      logger.error("VirusController - Error fetching virus by name", err)
      if (err.message === "VirusNotFound") {
        res.status(404).json({ error: MESSAGES.VIRUS_NOT_FOUND_BY_NAME })
      } else {
        res
          .status(500)
          .json({
            error: MESSAGES.FAILED_TO_RETRIEVE_VIRUS_BY_NAME,
            details: err.message,
          })
      }
    }
  }

  async getByCode(req, res) {
    logger.info(`GET: /api/viruses by Code: ${req.params.cv}`)
    try {
      const virus = await VirusService.getOne({ cv: req.params.cv })
      const outputDTO = new VirusOutputDTO(virus)
      res
        .status(200)
        .json({ message: MESSAGES.VIRUS_RETRIEVED_BY_CODE, data: outputDTO })
    } catch (err) {
      logger.error("VirusController - Error fetching virus by code", err)
      if (err.message === "VirusNotFound") {
        res.status(404).json({ error: MESSAGES.VIRUS_NOT_FOUND_BY_CODE })
      } else {
        res
          .status(500)
          .json({ error: MESSAGES.FAILED_TO_RETRIEVE_VIRUS_BY_CODE })
      }
    }
  }

  async update(req, res) {
    logger.info(`PUT: /api/viruses by Code: ${req.params.cv}`)
    try {
      const inputDTO = new VirusInputDTO(req.body)
      const virus = await VirusService.update(req.params.cv, inputDTO)
      const outputDTO = new VirusOutputDTO(virus)
      res.status(200).json({ message: MESSAGES.VIRUS_UPDATED, data: outputDTO })
    } catch (err) {
      logger.error("VirusController - Error updating virus", err)
      if (err.message === "MissingRequiredFields") {
        res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS })
      } else if (err.message === "VirusNotFound") {
        res.status(404).json({ error: MESSAGES.VIRUS_NOT_FOUND_BY_CODE })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_VIRUS,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_UPDATE_VIRUS })
      }
    }
  }

  async delete(req, res) {
    logger.info(`DELETE: /api/viruses by Code: ${req.params.cv}`)
    try {
      await VirusService.delete(req.params.cv)
      res.status(200).json({ message: MESSAGES.VIRUS_DELETED })
    } catch (err) {
      logger.error("VirusController - Error deleting virus", err)
      if (err.message === "VirusNotFound") {
        res.status(404).json({ error: MESSAGES.VIRUS_NOT_FOUND_BY_CODE })
      } else if (err.message === "OutbreakAssociated") {
        res.status(400).json({
          error: MESSAGES.CANNOT_DELETE_OUTBREAKS_ASSOCIATED,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_DELETE_VIRUS })
      }
    }
  }
}

export default new VirusController()
