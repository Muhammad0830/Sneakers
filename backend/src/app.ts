import express from "express";
import cors from "cors";
import unknownEndpoint from "./middlewares/middleware";
import sneakersRouter from "./routes/sneakers";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/sneakers", sneakersRouter);

app.use(unknownEndpoint);

export default app;
