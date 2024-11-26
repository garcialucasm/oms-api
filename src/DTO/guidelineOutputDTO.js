class GuidelineOutputDTO {
    constructor(guideline) {
      this.cg = guideline.cg
      this.outbreak = guideline.outbreak
      this.validityPeriod = guideline.validityPeriod
      this.createdAt = guideline.createdAt
      this.isExpired = guideline.isExpired
      this.updatedAt = guideline.updatedAt
    }
  }
  
  export default GuidelineOutputDTO