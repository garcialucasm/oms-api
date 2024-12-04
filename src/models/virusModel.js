import { Schema, model } from "mongoose"

const VirusSchema = new Schema(
  {
    cv: {
      type: String,
      require: true,
      unique: true,
      match: [
        /^[A-Za-z]{2}[0-9]{2}$/,
        "Virus code must start with 2 letters and end with 2 numerical characters",
      ],
      lowercase: true,
    },
    name: {
      type: String,
      unique: true,
      lowercase: true,
      set: (value) => value?.replace(/\s+/g, " ").trim(),
    },
  },
  { collection: "viruses", timestamps: true }
)

export default model("Virus", VirusSchema)
