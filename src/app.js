import {} from "dotenv/config";
import express from "express";

import { zoneRoutes } from "./routes/zoneRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`OMS api app listening on ports ${port}`);
});

app.use("/api/zones", zoneRoutes);
