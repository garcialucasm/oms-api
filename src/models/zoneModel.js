import { Schema, model } from "mongoose";

const ZoneSchema = new Schema(
  {
    cz: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^[A-Za-z]{1}[0-9]{1}$/,
        "Zone code must have 1 letter and 1 number",
      ],
      minlength: [2, "Zone code must be exatcly 2 characters"],
      maxlength: [2, "Zone code must be exatcly 2 characters"],
    },
    name: String,
  },
  { collection: "zones" }
);

export default model("Zone", ZoneSchema);
