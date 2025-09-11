import fs from "fs";
import path from "path";

export const config = {
  serverPort: Number(process.env.PORT) || 10000,
  db: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, "../CA_CERT/ca.pem")),
    },
  },
  jwtSecret: process.env.JWT_SECRET!,
};
