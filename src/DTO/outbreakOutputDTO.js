class OutbreakOutputDTO {
  constructor(outbreak) {
    this.co = outbreak.co
    this.virus = outbreak.virus?.cv || outbreak.virus
    this.zone = outbreak.zone?.cz || outbreak.zone
    this.startDate = outbreak.startDate
    this.endDate = outbreak.endDate
    this.condition = outbreak.condition
    this.createdAt = outbreak.createdAt
    this.updatedAt = outbreak.updatedAt
  }
}

export default OutbreakOutputDTO
