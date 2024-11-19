import VirusService from "../services/virusService.js"
class VirusController {
  async create(req, res) {
    try {
      const { cv, name } = req.body
      await VirusService.create({ cv, name })
      return res.status(201).json("Virus created")
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message} `
        }
        res.status(400).json({ error: errorMessage.trim() });
      } else if (err.message === "MissingRequiredFields") {
        return res.status(400).json({ error: "Missing required fields." });
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
    try {
      const virus = await VirusService.getAll()
      res.status(200).json(virus)
      if (!virus) {
        return res.status(404).json({ message: "No virus found" })
      }
    } catch (err) {
      res.status(500).json({ error: "Error retrieving viruses", details: err })
    }
  }

  async getByName(req, res) {
    try {
      const virus = await VirusService.list({ name: req.params.name })
      if (!virus) {
        return res.status(404).json({ message: "Virus not found" })
      }
      res.status(200).json(virus)
    } catch (err) {
      res.status(500).json({ error: "Error retrieving virus", details: err })
    }
  }

  async getByCode(req, res) {
    try {
      const virus = await VirusService.list({ cv: req.params.cv })
      if (!virus) {
        return res.status(404).json({ message: "Virus not found" })
      }
      res.status(200).json(virus)
    } catch (err) {
      res.status(500).json({ error: "Error retrieving virus", details: err })
    }
  }

  async update(req, res) {
    try {
      const virus = await VirusService.update(req.params.cv, req.body);
      res.status(200).json({ message: "Virus updated!", virus });
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message} `
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.name === "VirusNotFound") {
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
    try {
      await VirusService.delete(req.params.cv)
      res.status(200).json({ message: "Virus deleted!" })
    } catch (err) {
      if (err.name === "VirusNotFound") {
        res
          .status(400)
          .json({ error: "Virus not found with the given virus code" })
      } else {
        res
          .status(500)
          .json({ error: "Error deleting vius", details: err.message })
      }
    }
  }
}
export default new VirusController()
