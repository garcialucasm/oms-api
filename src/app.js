import {} from "dotenv/config"
import mongoose from "mongoose"
import express from "express"
import { swaggerUi, specs } from "./swagger.js"

import { virusRoutes } from "./routes/virusRoutes.js"
import { outbreakRoutes } from "./routes/outbreakRoutes.js"
import { zoneRoutes } from "./routes/zoneRoutes.js"
import { countryRoutes } from "./routes/countryRoutes.js"
import { guidelineRoutes } from "./routes/guidelineRoutes.js"
import { userRoutes } from "./routes/userRoutes.js"
import GuidelineService from "./services/guidelineService.js"
import logger from "./logger.js"

const dbConfig = {
  test: process.env.DB_TEST_CONNECTION_STRING,
  dev: process.env.DB_CONNECTION_STRING || "mongodb://mongo:27017/omsdatabase",
}

const mongoConnectionString = dbConfig[process.env.NODE_ENV]
const port = process.env.PORT || 3000
const app = express()

app.use(express.json())

mongoose.set("strictQuery", true)
mongoose
  .connect(mongoConnectionString || `mongodb://mongo:27017/omsdatabase`)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) => logger.error("Could not connect to MongoDB:", error))

const server = app.listen(port, () => {
  logger.info(`OMS-API App listening on ports ${port}`)
})

app.use("/api/viruses", virusRoutes)
app.use("/api/zones", zoneRoutes)
app.use("/api/countries", countryRoutes)
app.use("/api/outbreaks", outbreakRoutes)
app.use("/api/guidelines", guidelineRoutes)
app.use("/api/auth", userRoutes)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

GuidelineService.updateValidity()

const timeUntilMidnight = () => {
  const now = new Date()
  const nextMidnight = new Date(now)
  nextMidnight.setHours(24, 0, 0, 0)
  return nextMidnight - now
}

if (process.env.NODE_ENV !== "test") {
  setTimeout(() => {
    GuidelineService.updateValidity()
    setInterval(() => {
      GuidelineService.updateValidity()
    }, 24 * 60 * 60 * 1000)
  }, timeUntilMidnight())
}

export { app, server }
