import express from "express";
import createHttpError from "http-errors";
import AccommadationModel from "./schema.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const newAccommadation = new AccommadationModel(req.body);
    const { _id } = await newAccommadation.save();
    res.send({ _id });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const Accommadations = await AccommadationModel.find();
    res.send(Accommadations);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const Accommadation = await AccommadationModel.findById(req.params.id);
    res.send(Accommadation);
  } catch (error) {}
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedAccommadation = await AccommadationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );
    if (!updatedAccommadation) {
      res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }
    res.send(updatedAccommadation);
  } catch (error) {
    next();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedAccommadation = await AccommadationModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAccommadation) {
      res
        .status(404)
        .send({ message: `Accommadation with ${req.params.id} is not found!` });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
