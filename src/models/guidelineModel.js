import { Schema, model } from "mongoose"

const GuidelineSchema = new Schema(
  {
    cg: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^[0-9]{2}[A-Za-z]{2}$/,
        "Guideline code must have 2 numbers and 2 letters",
      ],
      minlength: [4, "Guideline code must be exatcly 4 characters"],
      maxlength: [4, "Guideline code must be exatcly 4 characters"],
    },
    outbreak: {
      type: Schema.Types.ObjectId,
      ref: "Outbreak",
      required: true,
    },
    validityPeriod: { type: Number, required: true },
    isExpired: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "guidelineDate", updatedAt: null },
    collection: "guidelines",
  }
)

export default model("Guideline", GuidelineSchema)
