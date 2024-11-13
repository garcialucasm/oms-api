import { Schema, model } from "mongoose";

const VirusSchema = new Schema(
  {
    cv: {
      type: String,
      require: true,
      unique: true,
      minlength: 4,
      maxlength: 4,
      match: [
        /^[A-Za-Z]{2}[0-9]{2}$/,
        "cv must be start with 2 letters and end with 2 numerical characters",
      ],
    },
    name: {
      type: String,
      unique: true,
    },
  },
  { collection: "viruses" }
);

export default model("Virus", VirusSchema);
