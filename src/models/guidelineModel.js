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
      lowercase: true
    },
    outbreak: {
      type: Schema.Types.ObjectId,
      ref: "Outbreak",
      required: true,
    },
    validityPeriod: { type: Number, required: true, min: [0, "Validity period cannot be negative"] },
    isExpired: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "guidelines",
  }
)

export default model("Guideline", GuidelineSchema)
