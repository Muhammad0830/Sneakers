import express from "express";
import cors from "cors";
import unknownEndpoint from "./middlewares/middleware";
import sneakersRouter from "./routes/sneakers";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/sneakers", sneakersRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use(unknownEndpoint);

export default app;
