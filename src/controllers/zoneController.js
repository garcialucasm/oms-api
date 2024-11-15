import ZoneService from "../services/zoneService.js"
class ZoneController {
  async createZone(req, res) {
    console.log("POST: /api/zones - " + JSON.stringify(req.body))
    try {
      const { cz, name } = req.body
      await ZoneService.save({ cz, name })
      return res.status(201).json("Zone created")
    } catch (err) {
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: "Duplicate zone code or zone name. Please use unique values.",
        })
      } else {
        res
          .status(500)
          .json({ error: "Error saving zone", details: err.message })
      }
    }
  }

  async getAllZones(req, res) {
    console.log("GET:/api/zones")
    try {
      const zones = await ZoneService.list()
      return res.status(200).json(zones)
    } catch (err) {
      res.status(500).json({ Error: "Error retrieving zones", details: err })
    }
  }

  async getZonesByName(req, res) {
    console.log("GET:/api/zones by Name: " + req.params.name)
    try {
      const zone = await ZoneService.listByName(req.params.name)
      if (!zone) {
        return res.status(404).json({ message: "Zone not found" })
      }
      return res.status(200).json(zone)
    } catch (err) {
      res.status(500).json({ error: "Error retrieving zone", details: err })
    }
  }

  async getZonesByCode(req, res) {
    console.log("GET:/api/zones by Code: " + req.params.cz)
    try {
      const zone = await ZoneService.listByCode(req.params.cz)
      if (!zone) {
        return res.status(404).json({ message: "Zone not found" })
      }
      return res.status(200).json(zone)
    } catch (err) {
      res.status(500).json({ error: "Error retrieving zone", details: err })
    }
  }

  async updateZoneByCode(req, res) {
    console.log(
      "PUT:/api/zones: " + req.params.cz + " - " + JSON.stringify(req.body)
    )
    try {
      const { cz, name } = req.body
      const zone = await ZoneService.editByCode(req.params.cz, { cz, name })
      return res.status(201).json({ message: "Zone updated: ", zone })
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
          .json({ error: "Zone not found with the given zone code" })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: "Duplicate zone code or zone name. Please use unique values.",
        })
      } else {
        res.status(500).json({ error: "Error updating zone", details: err })
      }
    }
  }

  async deleteZoneByCode(req, res) {
    console.log(`DELETE:/api/zones: ${req.params.cz}`)
    try {
      await ZoneService.removeByCode(req.params.cz)
      return res.status(200).json({ message: "deleted" })
    } catch (err) {
      if (err.statusCode === 400) {
        res
          .status(400)
          .json({ error: "Zone not found with the given zone code" })
      } else {
        res.status(500).json({ error: `Error deleting Zone`, details: err })
      }
    }
  }
}

export default new ZoneController()
