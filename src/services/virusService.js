import Virus from "../models/virusModel.js"

class VirusService {
  async create(data) {
    const virus = new Virus(data)
    await virus.save()
  }

  async getAll() {
    return await Virus.find().exec()
  }

  async list(data) {
    return await Virus.find(data).exec()
  }

  async update(cv, data) {
    const virus = await Virus.findOne({ cv: cv })
    if (!virus) {
      const error = new Error()
      error.name = "VirusNotFound"
      throw error
    }
    Object.assign(virus, data)
    await virus.save()
  }

  async delete(cv) {
    const virus = await Virus.findOne({ cv: cv }).exec()
    if (!virus) {
      const error = new Error()
      error.name = "VirusNotFound"
      throw error
    }
    await virus.deleteOne()
  }
}

export default new VirusService()
