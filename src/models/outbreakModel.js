import { Schema, model } from "mongoose"

const OutbreakSchema = new Schema(
  {
    co: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[0-9]{1}[A-Za-z]{1}$/,
        "Outbreak code must start with 1 numerical character and end with 1 letter.",
      ],
    },
    virus: {
      type: Schema.Types.ObjectId,
      ref: "Virus",
      required: true,
    },
    zone: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v <= Date.now()
        },
        message: "Date of detection cannot be after the current date.",
      },
    },
    endDate: {
      type: Date,
      default: null,
    },
    condition: {
      type: String,
      default: "active",
      match: [
        /^(active|occurred)$/,
        "The value of condition must be either 'active' or 'occurred'.",
      ],
    },
  },
  { collection: "outbreaks", timestamps: true }
)

export default model("Outbreak", OutbreakSchema)
