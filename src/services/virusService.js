import Virus from "../models/virusModel.js"
import Outbreak from "../models/outbreakModel.js"

class VirusService {
  async create(virus) {
    await virus.save()
    return virus
  }

  async getAll() {
    const viruses = await Virus.find().exec()
    if (viruses.length === 0) {
      throw new Error("VirusNotFound")
    }
    return viruses
  }

  async getOne(filter) {
    const virus = await Virus.findOne(filter).exec()
    if (!virus) {
      throw new Error("VirusNotFound")
    }
    return virus
  }

  async update(code, data) {
    const virus = await Virus.findOne({ cv: code })
    if (!virus) {
      throw new Error("VirusNotFound")
    }

    virus.cv = data.cv || virus.cv
    virus.name = data.name || virus.name

    await virus.save()
    return virus
  }

  async delete(cv) {
    const virus = await Virus.findOne({ cv }).exec()
    if (!virus) {
      throw new Error("VirusNotFound")
    }

    const outbreak = await Outbreak.findOne({ virus: virus._id })
    if (outbreak) {
      throw new Error("OutbreakAssociated")
    }

    await virus.deleteOne()
  }
}

export default new VirusService()
