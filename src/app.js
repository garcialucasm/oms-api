import {} from "dotenv/config";
import express from "express";

import { zoneRoutes } from "./routes/zoneRoutes.js";
import { virusRoutes } from "./routes/virusRoutes.js";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`OMS api app listening on ports ${port}`);
});

app.use("/api/viruses", virusRoutes);
app.use("/api/zones", zoneRoutes);
