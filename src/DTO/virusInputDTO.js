import Virus from "../models/virusModel.js"

class VirusInputDTO {
  constructor(data) {
    const { cv, name } = data

    if (!cv || !name) {
      throw new Error("MissingRequiredFields")
    }

    this.cv = cv
    this.name = name
  }

  async toVirus() {
    return new Virus({
      cv: this.cv,
      name: this.name,
    })
  }
}

export default VirusInputDTO
