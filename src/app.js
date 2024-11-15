import {} from "dotenv/config"
import mongoose from "mongoose"
import express from "express"

import { zoneRoutes } from "./routes/zoneRoutes.js"
import { virusRoutes } from "./routes/virusRoutes.js"

const mongoConnectionString = process.env.DB_CONNECTION_STRING
const port = process.env.PORT || 3000
const app = express()

app.use(express.json())

mongoose.set("strictQuery", true)
mongoose
  .connect(mongoConnectionString || `mongodb://mongo:27017/omsdatabase`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error))

app.listen(port, () => {
  console.log(`OMS-API App listening on ports ${port}`)
})

app.use("/api/viruses", virusRoutes)
app.use("/api/zones", zoneRoutes)
