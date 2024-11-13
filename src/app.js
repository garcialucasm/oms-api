import {} from "dotenv/config";
import express from "express";

import zoneRoutes from "./routes/zoneRoutes"
import virusRoutes from "./routes/virusRoutes"
import outbreakRoutes from "./routes/outbreakRoutes"
import countryRoutes from "./routes/countryRoutes"
import guidelineRoutes from "./routes/guidelineRoutes"

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`OMS api app listening on ports ${port}`);
});

app.use('/api/zones', zoneRoutes);
app.use('/api/virus', virusRoutes);
app.use('/api/outbreaks', outbreakRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/guidelines', guidelineRoutes);