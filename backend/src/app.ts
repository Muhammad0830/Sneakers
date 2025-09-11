import express from "express";
import cors from "cors";
import unknownEndpoint from "./middlewares/middleware";
import sneakersRouter from "./routes/sneakers";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import cookieParser from "cookie-parser";

const app = express();

// enable CORS for the frontend origin
const allowedOrigins = [
  "http://localhost:3000",
  "https://sneakers-l9jb.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/sneakers", sneakersRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use(unknownEndpoint);

export default app;
