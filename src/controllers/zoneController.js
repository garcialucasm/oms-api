import ZoneService from "../services/zoneService.js"
import ZoneInputDTO from "../DTO/zoneInputDTO.js"
import ZoneOutputDTO from "../DTO/zoneOutputDTO.js"


import logger from "../logger.js"
import { MESSAGES } from "../utils/responseMessages.js"

class ZoneController {
  async createZone(req, res) {
    logger.info("POST: /api/zones")
    try {
      const { cz, name } = req.body
      const inputDTO = new ZoneInputDTO({cz, name});
      const zoneModel = await inputDTO.toZone();
      const savedZone = await ZoneService.save(zoneModel);
      const outputDTO = new ZoneOutputDTO(savedZone);
      res.status(201).json({
        message: MESSAGES.ZONE_CREATED,
        data: outputDTO,
      })
    } catch (err) {
      logger.error("ZoneController - Error creating zone")
      if (err.message === "MissingRequiredFields") {
        res.status(400).json({error: MESSAGES.MISSING_REQUIRED_FIELDS})
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_ZONE,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_CREATE_ZONE })
      }
    }
  }

  async getAllZones(req, res) {
    logger.info("GET:/api/zones")
    try {
      const zones = await ZoneService.list()
      const outputDTOs = zones.map((zone) => new ZoneOutputDTO(zone))
      res.status(200).json({ message: MESSAGES.ZONES_RETRIEVED, data: outputDTOs })
    } catch (err) {
      logger.error("ZoneController - Failed to retrieve zones")
      if (err.message === "ZoneNotFound") {
        res.status(404).json({ error: MESSAGES.NO_ZONES_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_ZONES })
      }
    }
  }

  async getZonesByName(req, res) {
    logger.info("GET:/api/zones by Name: " + req.params.name)
    try {
      const zone = await ZoneService.listByName(req.params.name)
      const outputDTO = new ZoneOutputDTO(zone)
      res.status(200).json({ message: MESSAGES.ZONE_RETRIEVED_BY_NAME, data: outputDTO })
    } catch (err) {
      logger.error("ZoneController - Failed to retrieve zone by name")
      if (err.message === "ZoneNotFound") {
        res.status(404).json({ error: MESSAGES.ZONE_NOT_FOUND_BY_NAME })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_ZONE_BY_NAME })
      }
    }
  }

  async getZonesByCode(req, res) {
    logger.info("GET:/api/zones by Code: " + req.params.cz)
    try {
      const zone = await ZoneService.listByCode(req.params.cz)
      const outputDTO = new ZoneOutputDTO(zone)
      res.status(200).json({ message: MESSAGES.ZONE_RETRIEVED_BY_CODE, data: outputDTO })
    } catch (err) {
      logger.error("ZoneController - Failed to retrieve zone by code")
      if (err.message === "ZoneNotFound") {
        res.status(404).json({ error: MESSAGES.ZONE_NOT_FOUND_BY_CODE })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_ZONE_BY_CODE })
      }
    }
  }

  async updateZoneByCode(req, res) {
    logger.info("PUT:/api/zones: " + req.params.cz)
    try {
      const { cz, name } = req.body
      const inputDTO = new ZoneInputDTO({cz, name})
      const zone = await ZoneService.editByCode(req.params.cz, inputDTO)
      const outputDTO = new ZoneOutputDTO(zone)
      res.status(201).json({ message: MESSAGES.ZONE_UPDATED, data: outputDTO })
    } catch (err) {
      logger.error("ZoneController - Error updating zone")
      if(err.message === "MissingRequiredFields") {
        res.status(400).json({error: MESSAGES.MISSING_REQUIRED_FIELDS})
      } else if (err.message === "ZoneNotFound") {
        res
          .status(400)
          .json({ error: MESSAGES.ZONE_NOT_FOUND_BY_CODE })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_ZONE,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_UPDATE_ZONE })
      }
    }
  }

  async deleteZoneByCode(req, res) {
    logger.info("DELETE:/api/zones: " + req.params.cz)
    try {
      await ZoneService.removeByCode(req.params.cz)
      res.status(200).json({ message: MESSAGES.ZONE_DELETED, data: req.params.cz })
    } catch (err) {
      logger.error("ZoneController - Error deleting zone")
      if (err.message === "ZoneNotFound") {
        res
          .status(400)
          .json({ error: MESSAGES.ZONE_NOT_FOUND_BY_CODE })
      } else if(err.message === "CountryAssociated") {
        res.status(400).json({error: MESSAGES.CANNOT_DELETE_COUNTRIES_ASSOCIATED})
      } else if(err.message === "OutbreakAssociated") {
        res.status(400).json({error: MESSAGES.CANNOT_DELETE_OUTBREAKS_ASSOCIATED})
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_DELETE_ZONE })
      }
    }
  }
}

export default new ZoneController()
