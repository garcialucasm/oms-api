import {} from "dotenv/config";
import express from "express";

import {virusRoutes} from "./routes/virusRoutes.js"

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`OMS api app listening on ports ${port}`);
});


app.use('/api/viruses', virusRoutes);
