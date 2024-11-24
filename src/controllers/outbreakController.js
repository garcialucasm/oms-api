import OutbreakService from "../services/outbreakService.js"
import Outbreak from "../models/outbreakModel.js"
import Virus from "../models/virusModel.js"
import Zone from "../models/zoneModel.js"
import logger from "../logger.js"

class OutbreakController {
  async create(req, res) {
    logger.info("POST: /api/outbreaks")
    try {
      const { co, virus, zone, startDate, endDate } = req.body

      const outbreak = await OutbreakService.create({
        co,
        virus,
        zone,
        startDate,
        endDate,
      })

      res.status(201).json({ message: "New Outbreak created!", data: outbreak })
    } catch (err) {
      logger.error("OutbreakController - Error creating outbreak")
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message} `
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.message === "InvalidStartDateFormat") {
        res.status(400).json({ error: "Invalid startDate format" })
      } else if (err.message === "FutureStartDate") {
        res
          .status(400)
          .json({ error: "Value of startDate cannot be in the future" })
      } else if (err.message === "InvalidEndDateFormat") {
        res.status(400).json({ error: "Invalid endDate format" })
      } else if (err.message === "EndDateBeforeStartDate") {
        res.status(400).json({
          error:
            "endDate cannot take place before startDate. Please insert an endDate posterior to startDate.",
        })
      } else if (err.message === "FutureEndDate") {
        res
          .status(400)
          .json({ error: "Value of endDate cannot be in the future" })
      } else if (err.message === "VirusNotFound") {
        res
          .status(400)
          .json({ error: "Virus not found with the given virus code" })
      } else if (err.message === "ZoneNotFound") {
        res
          .status(400)
          .json({ error: "Zone not found with the given zone code" })
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({ error: "Missing required fields" })
      } else if (err.code === 11000) {
        res.status(400).json({
          error:
            "Duplicate outbreak code. Please use a unique value for this field.",
        })
      } else if (err.message === "OutbreakAlreadyExists") {
        res.status(400).json({
          error:
            "Already exists an active outbreak in this zone caused by this virus.",
        })
      } else {
        res.status(500).json({ error: "Error saving Outbreak", details: err })
      }
    }
  }

  async getAll(req, res) {
    logger.info("GET:/api/outbreaks")
    try {
      const outbreaks = await OutbreakService.getAll()
      res.status(200).json({ message: "Outbreaks found!", data: outbreaks })
    } catch (err) {
      logger.error("OutbreakController - Error retrieving outbreaks")
      if (err.message === "OutbreakNotFound") {
        res.status(404).json({ error: "No outbreaks found" })
      } else {
        res
          .status(500)
          .json({ error: "Error retrieving outbreaks", details: err })
      }
    }
  }

  async getByCode(req, res) {
    logger.info("GET:/api/oubreaks by Code: " + req.params.co)
    try {
      const outbreak = await OutbreakService.listByOutbreak({
        co: req.params.co,
      })
      res.status(200).json({ message: "Outbreak found!", data: outbreak })
    } catch (err) {
      logger.error("OutbreakController - Error retrieving outbreak")
      if (err.message === "OutbreakNotFound") {
        res.status(404).json({ error: "No outbreak found with the given code" })
      } else {
        res
          .status(500)
          .json({ error: "Error retrieving outbreaks", details: err })
      }
    }
  }

  async getByVirusCode(req, res) {
    logger.info("GET:/api/oubreaks by Virus Code: " + req.params.cv)
    try {
      const outbreak = await OutbreakService.listByVirus({ cv: req.params.cv })
      res.status(200).json({ message: "Outbreaks found!", data: outbreak })
    } catch (err) {
      logger.error("OutbreakController - Error retrieving outbreak")
      if (err.message === "VirusNotFound") {
        res.status(400).json({ error: "No virus matches the given code" })
      } else if (err.message === "OutbreakNotFound") {
        res
          .status(404)
          .json({ error: "No outbreak found with the given virus code" })
      } else {
        res
          .status(500)
          .json({ error: "Error retrieving outbreaks", details: err })
      }
    }
  }

  async getByZoneCode(req, res) {
    logger.info("GET:/api/oubreaks by Zone Code: " + req.params.cz)
    try {
      const outbreak = await OutbreakService.listByZone({ cz: req.params.cz })
      res.status(200).json({ message: "Outbreaks found!", data: outbreak })
    } catch (err) {
      logger.error("OutbreakController - Error retrieving outbreak")
      res
      if (err.message === "ZoneNotFound") {
        res.status(400).json({ error: "No zone matches the given code" })
      } else if (err.message === "OutbreakNotFound") {
        res
          .status(404)
          .json({ error: "No outbreak found with the given zone code" })
      } else {
        res
          .status(500)
          .json({ error: "Error retrieving outbreaks", details: err })
      }
    }
  }

  async getAllByCondition(req, res) {
    logger.info("GET:/api/oubreaks by Condition: " + req.params.condition)
    try {
      const outbreak = await OutbreakService.listActOcc(req.params.condition)
      res.status(200).json({ message: "Outbreaks found!", data: outbreak })
    } catch (err) {
      logger.error("OutbreakController - Error retrieving outbreaks")
      if (err.message === "InvalidParameters") {
        res
          .status(404)
          .json({ error: "Invalid search parameter. Try active or occurred." })
      } else if (err.message === "OutbreakNotFound") {
        res
          .status(404)
          .json({ error: "No outbreak found with the given condition" })
      } else {
        res
          .status(500)
          .json({ error: "Error retrieving outbreaks", details: err })
      }
    }
  }

  async update(req, res) {
    logger.info("PUT:/api/outbreaks: " + req.params.co)
    try {
      const { co, virus, zone, startDate, endDate } = req.body

      const outbreak = await OutbreakService.update(req.params.co, {
        co,
        virus,
        zone,
        startDate,
        endDate,
      })
      res.status(200).json({ message: "Outbreak updated!", data: outbreak })
    } catch (err) {
      logger.error("OutbreakController - Error updating outbreak")
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message} `
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.message === "OutbreakNotFound") {
        res
          .status(400)
          .json({ error: "Outbreak not found with the given outbreak code" })
      } else if (err.message === "InvalidStartDateFormat") {
        res.status(400).json({ error: "Invalid startDate format" })
      } else if (err.message === "FutureStartDate") {
        res
          .status(400)
          .json({ error: "Value of startDate cannot be in the future" })
      } else if (err.message === "FutureEndDate") {
        res
          .status(400)
          .json({ error: "Value of endDate cannot be in the future" })
      } else if (err.message === "InvalidEndDateFormat") {
        res.status(400).json({ error: "Invalid endDate format" })
      } else if (err.message === "EndDateBeforeStartDate") {
        res.status(400).json({
          error:
            "endDate cannot take place before startDate. Please insert an endDate posterior to startDate.",
        })
      } else if (err.message === "VirusNotFound") {
        res
          .status(400)
          .json({ error: "Virus not found with the given virus code" })
      } else if (err.message === "ZoneNotFound") {
        res
          .status(400)
          .json({ error: "Zone not found with the given zone code" })
      } else if (err.message === "OutbreakAlreadyExists") {
        res.status(400).json({
          error:
            "Already exists an active outbreak in this zone caused by this virus.",
        })
      } else if (err.code === 11000) {
        res.status(400).json({
          error:
            "Duplicate outbreak. Please use a unique value for this field.",
        })
      } else {
        res.status(500).json({ error: "Error updating outbreak", details: err })
      }
    }
  }

  async updateByZoneCodeVirusCode(req, res) {
    logger.info("PUT:/api/outbreaks: " + req.params.cz + " - " + req.params.cv)
    try {
      const { co, virus, zone, startDate, endDate } = req.body

      const outbreak = await OutbreakService.updateByCodes(
        req.params.cz,
        req.params.cv,
        {
          co,
          virus,
          zone,
          startDate,
          endDate,
        }
      )
      res.status(200).json({ message: "Outbreak updated!", data: outbreak })
    } catch (err) {
      logger.error("OutbreakController - Error updating outbreak")
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message} `
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.message === "OutbreakNotFound") {
        res.status(400).json({
          error:
            "Outbreak not found with the given pair of zone and virus codes",
        })
      } else if (err.message === "InvalidStartDateFormat") {
        res.status(400).json({ error: "Invalid startDate format" })
      } else if (err.message === "FutureStartDate") {
        res
          .status(400)
          .json({ error: "Value of startDate cannot be in the future" })
      } else if (err.message === "FutureEndDate") {
        res
          .status(400)
          .json({ error: "Value of endDate cannot be in the future" })
      } else if (err.message === "InvalidEndDateFormat") {
        res.status(400).json({ error: "Invalid endDate format" })
      } else if (err.message === "EndDateBeforeStartDate") {
        res.status(400).json({
          error:
            "endDate cannot take place before startDate. Please insert an endDate posterior to startDate.",
        })
      } else if (err.message === "VirusNotFound") {
        res
          .status(400)
          .json({ error: "Virus not found with the given virus code" })
      } else if (err.message === "ZoneNotFound") {
        res
          .status(400)
          .json({ error: "Zone not found with the given zone code" })
      } else if (err.message === "OutbreakAlreadyExists") {
        res.status(400).json({
          error:
            "Already exists an active outbreak in this zone caused by this virus.",
        })
      } else if (err.code === 11000) {
        res.status(400).json({
          error:
            "Duplicate outbreak. Please use a unique value for this field.",
        })
      } else {
        res.status(500).json({ error: "Error updating outbreak", details: err })
      }
    }
  }

  async delete(req, res) {
    logger.info("DELETE:/api/outbreaks: " + req.params.co)
    try {
      await OutbreakService.delete(req.params.co)
      res.status(200).json({ message: "Outbreak deleted!" })
    } catch (err) {
      logger.error("OutbreakController - Error deleting outbreak")
      if (err.message === "OutbreakNotFound") {
        res
          .status(400)
          .json({ error: "Outbreak not found with the given code" })
      } else if (err.message === "GuidelineAssociated") {
        res
          .status(400)
          .json({
            error:
              "Cannot delete outbreak because it has guidelines associated",
          })
      } else {
        res
          .status(500)
          .json({ error: "Error deleting outbreak", details: err.message })
      }
    }
  }
}

export default new OutbreakController()
