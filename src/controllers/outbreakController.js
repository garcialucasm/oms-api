import OutbreakService from "../services/outbreakService.js"
import Outbreak from "../models/outbreakModel.js"
import Virus from "../models/virusModel.js"
import Zone from "../models/zoneModel.js"

class OutbreakController {
  async create(req, res) {
    try {
      const { co, cv, cz, startDate, endDate } = req.body

      const outbreak = await OutbreakService.create({
        co,
        cv,
        cz,
        startDate,
        endDate,
      })

      res.status(201).json({ message: "New Outbreak created!", data: outbreak })
    } catch (err) {
      console.error("Error in createOutbreak:", err)
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
    try {
      const outbreaks = await OutbreakService.getAll()
      if (!outbreaks) {
        res.status(404).json({ error: "No outbreaks not found" })
      }
      res.status(200).json({ message: "Outbreaks found!", data: outbreaks })
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving outbreaks", details: err })
    }
  }

  async getByCode(req, res) {
    try {
      const outbreak = await OutbreakService.list({ co: req.params.co })
      if (!outbreak || outbreak.length === 0) {
        res.status(404).json({ error: "Outbreak not found" })
      }
      res.status(200).json({ message: "Outbreak found!", data: outbreak })
    } catch (err) {
      res.status(500).json({ error: "Error retrieving outbreak", details: err })
    }
  }

  async getByVirusCode(req, res) {
    try {
      const virus = await Virus.findOne({ cv: req.params.cv })
      if (!virus) {
        res.status(404).json({ error: "Virus not found" })
      }

      const outbreak = await OutbreakService.list({ cv: virus._id })
      if (!outbreak || outbreak.length === 0) {
        res.status(404).json({ error: "Outbreaks not found" })
      }
      res.status(200).json({ message: "Outbreaks found!", data: outbreak })
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving outbreaks", details: err })
    }
  }

  async getByZoneCode(req, res) {
    try {
      const zone = await Zone.findOne({ cz: req.params.cz })
      if (!zone) {
        res.status(404).json({ error: "Zone not found" })
      }
      const outbreak = await OutbreakService.list({ cz: zone._id })
      if (!outbreak || outbreak.length === 0) {
        res.status(404).json({ error: "Outbreaks not found" })
      }
      res.status(200).json({ message: "Outbreaks found!", data: outbreak })
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving outbreaks", details: err })
    }
  }

  async getAllByCondition(req, res) {
    try {
      const outbreak = await OutbreakService.listActOcc(req.params.condition)
      if (!outbreak || outbreak.length === 0) {
        res.status(404).json({ error: "Outbreaks not found" })
      }
      res.status(200).json({ message: "Outbreaks found!", data: outbreak })
    } catch (err) {
      if ((err.message = "InvalidParameters")) {
        res
          .status(404)
          .json({ error: "Invalid search parameter. Try active or occurred." })
      } else {
        res
          .status(500)
          .json({ error: "Error retrieving outbreaks", details: err })
      }
    }
  }

  async update(req, res) {
    try {
      const { co, cv, cz, startDate, endDate } = req.body

      const outbreak = await OutbreakService.update(req.params.co, {
        co,
        cv,
        cz,
        startDate,
        endDate,
      })
      res.status(200).json({ message: "Outbreak updated!", data: outbreak })
    } catch (err) {
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
    try {
      const { co, cv, cz, startDate, endDate } = req.body

      const outbreak = await OutbreakService.updateByCodes(
        req.params.cz,
        req.params.cv,
        {
          co,
          cv,
          cz,
          startDate,
          endDate,
        }
      )
      res.status(200).json({ message: "Outbreak updated!", data: outbreak })
    } catch (err) {
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
    try {
      await OutbreakService.delete(req.params.co)
      res.status(200).json({ message: "Outbreak deleted!" })
    } catch (err) {
      if (err.name === "OutbreakNotFound") {
        res
          .status(400)
          .json({ error: "Outbreak not found with the given code" })
      } else {
        res
          .status(500)
          .json({ error: "Error deleting outbreak", details: err.message })
      }
    }
  }
}

export default new OutbreakController()
