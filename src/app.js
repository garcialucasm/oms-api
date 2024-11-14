import {} from "dotenv/config";
import express from "express";

import { zoneRoutes } from "./routes/zoneRoutes.js";
import { virusRoutes } from "./routes/virusRoutes.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const connectionString = process.env.DB_CONNECTION_STRING;
mongoose.set("strictQuery", true);
mongoose
  .connect(connectionString || `mongodb://mongo:27017/omsdatabase`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error));

app.listen(port, () => {
  console.log(`OMS api app listening on ports ${port}`);
});

app.use("/api/viruses", virusRoutes);
app.use("/api/zones", zoneRoutes);
