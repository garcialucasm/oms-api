import { Schema, model } from "mongoose"

const CountrySchema = new Schema(
  {
    cc: {
      type: String,
      required: [true, "Country code is required"],
      unique: true,
      match: [/^[A-Za-z]{2}$/, "Country code must have exactly 2 letters"],
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Country name is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    zone: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      required: true
    }
  },
  { collection: "countries", timestamps: true }
)

export default model("Country", CountrySchema)
