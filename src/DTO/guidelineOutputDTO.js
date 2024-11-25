class GuidelineOutputDTO {
    constructor(guideline) {
      this.cg = guideline.cg
      this.outbreak = guideline.outbreak?.co || guideline.outbreak
      this.validityPeriod = guideline.validityPeriod
      this.createdAt = guideline.createdAt
      this.isExpired = guideline.condition
      this.updatedAt = guideline.updatedAt
    }
  }
  
  export default GuidelineOutputDTO