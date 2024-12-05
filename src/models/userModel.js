import { Schema, model } from "mongoose"

const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      require: true,
      uppercase: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    idCard: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
      match: /^(employee|admin)$/,
    },
    status: {
      type: String,
      require: true,
      default: "active",
      match: /^(active|inactive)$/,
    },
  },
  { collection: "users", timestamps: true }
)

export default model("User", UserSchema)
