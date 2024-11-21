import GuidelineService from "../services/guidelineService.js"
class GuidelineController {
  async createGuideline(req, res) {
    console.log("POST: /api/guidelines - " + JSON.stringify(req.body))
    try {
      const { cg, outbreak, validityPeriod } = req.body
      await GuidelineService.save({ cg, outbreak, validityPeriod })

      res.status(201).json({ message: "Guideline created" })
    } catch (err) {
      console.log("err.message:", err.message)
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.message === "OutbreakNotFound") {
        res
          .status(400)
          .json({ error: "No outbreaks with the given outbreak code (co)" })
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
      res.status(200).json(guidelines)
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
      res.status(200).json(guideline)
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
      res.status(200).json(guideline)
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving Guideline", details: err })
    }
  }

  async getGuidelineByCountryAndOutbreak(req, res) {
    console.log(
      "GET:/api/guidelines by Country and Outbreak: " +
        /* req.params.cc + */
        req.params.co
    )
    try {
      const guideline = await GuidelineService.listByCountryAndOutbreak(
        /* req.params.cc, */
        req.params.co
      )
      if (!guideline) {
        return res.status(404).json({ message: "Guideline not found" })
      }
      res.status(200).json(guideline)
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
      const { cg, outbreak, validityPeriod } = req.body
      const guideline = await GuidelineService.editByCode(
        req.params.cg,
        { cg, outbreak, validityPeriod }
      )
      res.status(201).json({ message: "Guideline updated: ", guideline })
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error:"
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.message === "GuidelineNotFound") {
        res
          .status(400)
          .json({ error: "Guideline not found with the given guideline code" })
      } else if (err.message === "OutbreakNotFound") {
        res
          .status(400)
          .json({ error: "Outbreak not found with the given outbreak code" })
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
      res.status(200).json({ message: "deleted" })
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
