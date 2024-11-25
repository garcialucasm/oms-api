import ZoneService from "../services/zoneService.js"
import ZoneInputDTO from "../DTO/zoneInputDTO.js"
import ZoneOutputDTO from "../DTO/zoneOutputDTO.js"

import logger from "../logger.js"

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
        message: "Zone created successfully",
        data: outputDTO,
      })
    } catch (err) {
      logger.error("ZoneController - Error creating zone")
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if(err.message === "MissingFields") {
        res.status(400).json({error: "Missing cz and/or name parameters"})
      } else if (err.code === 11000) {
        res.status(400).json({
          error: "Duplicate zone code or zone name. Please use unique values.",
        })
      } else {
        res.status(500).json({ error: "Error saving zone" })
      }
    }
  }

  async getAllZones(req, res) {
    logger.info("GET:/api/zones")
    try {
      const zones = await ZoneService.list()
      const outputDTOs = zones.map((zone) => new ZoneOutputDTO(zone))
      res.status(200).json({ message: "Zones found", data: outputDTOs })
    } catch (err) {
      logger.error("ZoneController - Failed to retrieve zones")
      if (err.message === "ZoneNotFound") {
        res.status(404).json({ error: "No zones found" })
      } else {
        res.status(500).json({ error: "Error retrieving zones" })
      }
    }
  }

  async getZonesByName(req, res) {
    logger.info("GET:/api/zones by Name: " + req.params.name)
    try {
      const zone = await ZoneService.listByName(req.params.name)
      const outputDTO = new ZoneOutputDTO(zone)
      res.status(200).json({ message: "Zone found", data: outputDTO })
    } catch (err) {
      logger.error("ZoneController - Failed to retrieve zone by name")
      if (err.message === "ZoneNotFound") {
        res.status(404).json({ error: "No zone found with the given name" })
      } else {
        res.status(500).json({ error: "Error retrieving zones" })
      }
    }
  }

  async getZonesByCode(req, res) {
    logger.info("GET:/api/zones by Code: " + req.params.cz)
    try {
      const zone = await ZoneService.listByCode(req.params.cz)
      const outputDTO = new ZoneOutputDTO(zone)
      res.status(200).json({ message: "Zone found", data: outputDTO })
    } catch (err) {
      logger.error("ZoneController - Failed to retrieve zone by code")
      if (err.message === "ZoneNotFound") {
        res.status(404).json({ error: "No zone found with the given code" })
      } else {
        res.status(500).json({ error: "Error retrieving zones" })
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
      res.status(201).json({ message: "Zone updated", data: outputDTO })
    } catch (err) {
      logger.error("ZoneController - Error updating zone")
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error:"
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.message === "ZoneNotFound") {
        res
          .status(400)
          .json({ error: "Zone not found with the given zone code" })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: "Duplicate zone code or zone name. Please use unique values.",
        })
      } else {
        res.status(500).json({ error: "Error updating zone" })
      }
    }
  }

  async deleteZoneByCode(req, res) {
    logger.info("DELETE:/api/zones: " + req.params.cz)
    try {
      await ZoneService.removeByCode(req.params.cz)
      res.status(200).json({ message: "Zone deleted", data: req.params.cz })
    } catch (err) {
      logger.error("ZoneController - Error deleting zone")
      if (err.message === "ZoneNotFound") {
        res
          .status(400)
          .json({ error: "Zone not found with the given zone code" })
      } else if(err.message === "CountryAssociated") {
        res.status(400).json({error: "Cannot delete zone because it has countries associated"})
      } else if(err.message === "OutbreakAssociated") {
        res.status(400).json({error: "Cannot delete zone because it has outbreaks associated"})
      } else {
        res.status(500).json({ error: "Error deleting Zone" })
      }
    }
  }
}

export default new ZoneController()
