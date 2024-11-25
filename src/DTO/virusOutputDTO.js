class VirusOutputDTO {
  constructor(virus) {
    if (!virus || !virus.cv || !virus.name) {
      throw new Error("InvalidVirusObject")
    }
    this.id = virus._id
    this.cv = virus.cv
    this.name = virus.name
    this.createdAt = virus.createdAt
    this.updatedAt = virus.updatedAt
  }
}

export default VirusOutputDTO
