import VirusService from "../services/virusService.js";
class VirusController {
  async createVirus(req, res) {
    console.log("🚀 ~ VirusController ~ createVirus ~ req:", req.body);
    try {
      const { cv, name } = req.body;
      await VirusService.create({ cv, name });
      return res.status(201).json("Virus created");
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: ";
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message} `;
        }
        res.status(400).json({ error: errorMessage.trim() });
      } else if (err.code === 11000) {
        res.status(400).json({
          error:
            "Duplicate virus code or name. Please use a unique values for both these fields.",
        });
      } else {
        res.status(500).json({ error: "Error saving virus", details: err });
      }
    }
  }

  async getAllViruses(req, res) {
    console.log("🚀 ~ VirusController ~ getAllViruses ~ req:", req.body);
    try {
      const virus = await VirusService.getAll();
      res.status(200).json(virus);
    } catch (err) {
      res.status(500).json({ error: "Error retrieving viruses", details: err });
    }
  }

  async getVirusByName(req, res) {
    console.log("🚀 ~ VirusController ~ getVirusByCode ~ req:", req.body);
    try {
      const virus = await VirusService.list({ name: req.params.name });
      if (!virus) {
        return res.status(404).json({ message: "Virus not found" });
      }
      res.status(200).json(virus);
    } catch (err) {
      res.status(500).json({ error: "Error retrieving virus", details: err });
    }
  }

  async getVirusByCode(req, res) {
    console.log("🚀 ~ VirusController ~ getVirusByCode ~ req:", req.body);
    try {
      const virus = await VirusService.list({ cv: req.params.cv });
      if (!virus) {
        return res.status(404).json({ message: "Virus not found" });
      }
      res.status(200).json(virus);
    } catch (err) {
      res.status(500).json({ error: "Error retrieving virus", details: err });
    }
  }

  async updateVirus(req, res) {
    console.log("🚀 ~ VirusController ~ updateVirus ~ req:", req);
    try {
      await VirusService.update(req.params.cv, req.body);
      res.status(200).json({ message: "Virus updated!" });
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: ";
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message} `;
        }
        res.status(400).json({ error: errorMessage.trim() });
      } else if (err.name === "VirusNotFound") {
        res
          .status(400)
          .json({ error: "Virus not found with the given virus code" });
      } else if (err.code === 11000) {
        res.status(400).json({
          error:
            "Duplicate virus code or name. Please use unique values for both these fields.",
        });
      } else {
        res.status(500).json({ error: "Error updating virus", details: err });
      }
    }
  }

  async deleteVirus(req, res) {
    try {
      await VirusService.delete(req.params.cv);
      res.status(200).json({ message: "Virus deleted!" });
    } catch (err) {
      if (err.name === "VirusNotFound") {
        res
          .status(400)
          .json({ error: "Virus not found with the given virus code" });
      } else {
        res
          .status(500)
          .json({ error: "Error deleting vius", details: err.message });
      }
    }
  }
}
export default new VirusController();
