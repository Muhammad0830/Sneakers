import express from "express";
const sneakersRouter = express.Router();

let data = [
  {
    id: 1,
    name: "sneakers1",
    description: "sneakers",
    price: 100,
    image: "https://i.ibb.co/4b2r0sX/sneakers.png",
    category: "sneakers",
  },
  {
    id: 2,
    name: "sneakers2",
    description: "sneakers2",
    price: 200,
    image: "https://i.ibb.co/4b2r0sX/sneakers.png",
    category: "sneakers2",
  },
];

sneakersRouter.get("/", (req: any, res: any) => {
  try {
    res.status(200).json(data);
  } catch (err: any) {
    if (res.status) {
      res.status(500).json({ message: err.message });
    } else {
      throw new Error(err.message);
    }
  }
});

export default sneakersRouter;
