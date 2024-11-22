import Virus from "../models/virusModel.js"
import Outbreak from "../models/outbreakModel.js"

class VirusService {
  async create(data) {
    const { cv, name } = data
    if (!cv || !name) {
      throw new Error("MissingRequiredFields")
    }
    const virus = new Virus(data)
    await virus.save()
    return virus
  }

  async getAll() {
    const viruses = await Virus.find().exec()
    if(!viruses) {
      throw new Error("VirusNotFound")
    }
    return viruses
  }

  async list(data) {
    const virus = await Virus.findOne(data).exec()
    if(!virus) {
      throw new Error("VirusNotFound")
    }
    return virus
  }

  async update(code, data) {
    const {cv, name} = data
    if(!cv && !name) {
      throw new Error("MissingFields")
    }

    const virus = await Virus.findOne({ cv: code })
    if (!virus) {
      throw new Error("VirusNotFound")
    }

    virus.cv = cv || virus.cv
    virus.name = name || virus.name

    await virus.save()
    return virus
  }

  async delete(cv) {
    const virus = await Virus.findOne({ cv: cv }).exec()
    if (!virus) {
      throw new Error("VirusNotFound")
    }
    const outbreak = await Outbreak.findOne({virus: virus._id})

    if(outbreak) {
      throw new Error("OutbreakAssociated")
    }
    await virus.deleteOne()
  }
}

export default new VirusService()
