class VirusController {
  // TODO remover a 'const virus' ja que nao é usada?
  async createVirus(req, res) {
    console.log("🚀 ~ VirusController ~ createVirus ~ req:", req.body);
    try {
      const { cv, name } = req.body;
      const virus = await VirusService.save({ cv, name });
      return res.status(201).json("Virus created");
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: ";
        for (field in err.errors) {
          errorMessage += `${err.errors[field].message} `;
        }
        res.status(400).json({ error: errorMessage.trim() });
      } else if (err.code === 11000) {
        res.status(400).json({
          error:
            "Duplicate cv and/or name. Please use a unique values for both these fields.",
        });
      } else {
        res.status(500).json({ error: "Error saving virus", details: err });
      }
    }
  }

  async getAllViruses(req, res) {
    console.log("🚀 ~ VirusController ~ getAllViruses ~ req:", req.body);
    try {
      const virus = await VirusService.list();
      res.status(200).json(virus);
    } catch (err) {
      res.status(500).json({ error: "Error retrieving viruses", details: err });
    }
  }

  async getVirusByCode(req, res) {
    console.log("🚀 ~ VirusController ~ getVirusByCode ~ req:", req.body);
    try {
      const virus = await VirusService.listByCode(req.params.cv);
      if (!virus) {
        return res.status(404).json({ message: "Virus not found" });
      }
      res.status(200).json(virus);
    } catch (err) {
      res.status(500).json({ error: "Error retrieving virus", details: err });
    }
  }

  async getOutbreaksByVirusCode(req, res) {
    console.log(
      "🚀 ~ VirusController ~ getOutbreaksByVirusCode ~ req:",
      req.body
    );
    try {
      const virus = await VirusService.listByCode(req.params.cv);
      if (!virus) {
        return res.status(404).json({ message: "Virus not found" });
      }
      const outbreak = await OutbreakService.list({ cv: req.params.cv });
      if (!outbreak) {
        return res
          .status(204)
          .json({ message: "No outbreaks from the selected virus" });
      }
      res.status(200).json(outbreak);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving outbreaks", details: err });
    }
  }

  // TODO remover a 'const virus' ja que nao é usada?
  async updateVirus(req, res) {
    console.log("🚀 ~ VirusController ~ updateVirus ~ req:", req);
    try {
      const virus = await VirusService.editVirus(req.params.cv, req.body);
      res.status(200).json({ message: "Virus updated!" });
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
            "Duplicate cv and/or name. Please use unique values for both these fields.",
        });
      } else {
        res.status(500).json({ error: "Error updating virus", details: err });
      }
    }
  }

  // TODO É para colocar ou nao o delete?

  /*  async deleteVirus(req, res) {
    try {
      const virus = await VirusService.removeVirus(req.params.cv);
      if (!virus) {
        return res.status(404).json({ message: "Virus not found" });
      }
      res.status(200).json({ message: "Virus deleted!" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error deleting vius", details: err.message });
    }
  } */
}

export default new VirusController();
