import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { config } from "./config";

const PORT = Number(config.port);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`server is running on port ${PORT}`);
});
