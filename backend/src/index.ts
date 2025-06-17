import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { config } from "./config";

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`server is running on port ${config.port}`);
});
