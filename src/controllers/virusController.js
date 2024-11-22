import VirusService from "../services/virusService.js"
import logger from "../logger.js"
class VirusController {
  async create(req, res) {
    logger.info("POST: /api/viruses")
    try {
      const { cv, name } = req.body
      const virus = await VirusService.create({ cv, name })
      res.status(201).json({ message: "Virus created!", data: virus })
    } catch (err) {
      logger.error("VirusController - Error creating virus")
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message} `
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({ error: "Missing required fields." })
      } else if (err.code === 11000) {
        res.status(400).json({
          error:
            "Duplicate virus code or name. Please use a unique values for both these fields.",
        })
      } else {
        res.status(500).json({ error: "Error saving virus", details: err })
      }
    }
  }

  async getAll(req, res) {
    logger.info("GET:/api/viruses")
    try {
      const viruses = await VirusService.getAll()
      res.status(200).json({ message: "Viruses found!", data: viruses })
    } catch (err) {
      logger.error("VirusController - Failed to retrieve virus")
      if (err.message === "VirusNotFound") {
        res.status(404).json({ error: "No virus found" })
      } else {
        res
          .status(500)
          .json({ error: "Error retrieving viruses", details: err })
      }
    }
  }

  async getByName(req, res) {
    logger.info("GET:/api/viruses by Name: " + req.params.name)
    try {
      const virus = await VirusService.list({ name: req.params.name })
      res.status(200).json({ message: "Virus found!", data: virus })
    } catch (err) {
      logger.error("VirusController - Failed to retrieve virus by name")
      if (err.message === "VirusNotFound") {
        res.status(404).json({ error: "Virus not found with the given name" })
      } else {
        res
          .status(500)
          .json({ error: "Error retrieving viruses", details: err })
      }
    }
  }

  async getByCode(req, res) {
    logger.info("GET:/api/viruses by Code: " + req.params.cv)
    try {
      const virus = await VirusService.list({ cv: req.params.cv })
      res.status(200).json({ message: "Virus found!", data: virus })
    } catch (err) {
      logger.error("VirusController - Failed to retrieve virus by code")
      if (err.message === "VirusNotFound") {
        res.status(404).json({ error: "Virus not found with the given code" })
      } else {
        res
          .status(500)
          .json({ error: "Error retrieving viruses", details: err })
      }
    }
  }

  async update(req, res) {
    logger.info("PUT:/api/viruses: " + req.params.cv)
    try {
      const virus = await VirusService.update(req.params.cv, req.body)
      res.status(200).json({ message: "Virus updated!", virus })
    } catch (err) {
      logger.error("VirusController - Error updating virus")
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message} `
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.message === "VirusNotFound") {
        res
          .status(400)
          .json({ error: "Virus not found with the given virus code" })
      } else if (err.code === 11000) {
        res.status(400).json({
          error:
            "Duplicate virus code or name. Please use unique values for both these fields.",
        })
      } else {
        res.status(500).json({ error: "Error updating virus", details: err })
      }
    }
  }

  async delete(req, res) {
    logger.info("DELETE:/api/viruses: " + req.params.cv)
    try {
      await VirusService.delete(req.params.cv)
      res.status(200).json({ message: "Virus deleted!" })
    } catch (err) {
      if (err.message === "VirusNotFound") {
        res
          .status(400)
          .json({ error: "Virus not found with the given virus code" })
      } else if (err.message === "OubreakAssociated") {
        req.status(400).json({
          error: "Cannot delete virus because it has outbreaks associated",
        })
      } else {
        res
          .status(500)
          .json({ error: "Error deleting virus", details: err.message })
      }
    }
  }
}
export default new VirusController()
