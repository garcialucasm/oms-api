import GuidelineService from "../services/guidelineService.js"
class GuidelineController {
  async createGuideline(req, res) {
    console.log("POST: /api/guidelines - " + JSON.stringify(req.body))
    try {
      const { cg, outbreak, validityPeriod } = req.body
      await GuidelineService.save({ cg, outbreak, validityPeriod }, outbreak)
      return res.status(201).json("Guideline created")
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: "Duplicate guideline code. Please use unique values.",
        })
      } else {
        res
          .status(500)
          .json({ error: "Error saving guideline", details: err.message })
      }
    }
  }

  async getAllGuidelines(req, res) {
    console.log("GET:/api/guidelines")
    try {
      const guidelines = await GuidelineService.list()
      return res.status(200).json(guidelines)
    } catch (err) {
      res
        .status(500)
        .json({ Error: "Error retrieving guidelines", details: err })
    }
  }

  async getGuidelinesByCode(req, res) {
    console.log("GET:/api/guidelines by Code: " + req.params.cg)
    try {
      const guideline = await GuidelineService.listByCode(req.params.cg)
      if (!guideline) {
        return res.status(404).json({ message: "Guideline not found" })
      }
      return res.status(200).json(guideline)
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving guideline", details: err })
    }
  }

  async getGuidelinesByStatus(req, res) {
    console.log("GET:/api/guidelines by Status: " + req.params.status)
    try {
      const guideline = await GuidelineService.listByStatus(req.params.status)
      if (!guideline) {
        return res.status(404).json({ message: "Guideline not found" })
      }
      return res.status(200).json(guideline)
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving Guideline", details: err })
    }
  }

  async getGudelinesByCountryAndOutbreak(req, res) {
    console.log(
      "GET:/api/guidelines by Country and Outbreak: " +
        req.params.cc +
        req.params.co
    )
    try {
      const guideline = await GuidelineService.listByCountryAndOutbreak(
        req.params.cc,
        req.params.co
      )
      if (!guideline) {
        return res.status(404).json({ message: "Guideline not found" })
      }
      return res.status(200).json(guideline)
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving Guideline", details: err })
    }
  }

  async updateGuidelineByCode(req, res) {
    console.log(
      "PUT:/api/guidelines: " + req.params.cg + " - " + JSON.stringify(req.body)
    )
    try {
      const { cg, zone, outbreak, validityPeriod } = req.body
      const guideline = await GuidelineService.editByCode(
        req.params.cg,
        req.body.outbreak,
        { cg, zone, outbreak, validityPeriod }
      )
      return res.status(201).json({ message: "Guideline updated: ", guideline })
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error:"
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.statusCode === 400) {
        res
          .status(400)
          .json({ error: "Guideline not found with the given code" })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: "Duplicate guideline code. Please use unique values.",
        })
      } else {
        res
          .status(500)
          .json({ error: "Error updating guideline", details: err })
      }
    }
  }

  async deleteGuidelineByCode(req, res) {
    console.log("DELETE:/api/guidelines: " + req.params.cg + " - ")
    try {
      await GuidelineService.removeByCode(req.params.cg)
      return res.status(200).json({ message: "deleted" })
    } catch (err) {
      if (err.statusCode === 400) {
        res
          .status(400)
          .json({ error: "Guideline not found with the given code" })
      } else {
        res
          .status(500)
          .json({ error: "Error deleting Guideline", details: err })
      }
    }
  }
}

export default new GuidelineController()
