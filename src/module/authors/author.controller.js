import { Router } from "express";
import { createAuthorImplicit } from "./author.service.js";

const authorRouter = Router();

authorRouter.post("/collection", async (req, res) => {
  try {
    const data = await createAuthorImplicit(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default authorRouter;
