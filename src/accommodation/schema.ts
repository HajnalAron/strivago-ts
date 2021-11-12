import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AccommadationSchema = new Schema({
  name: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  description: { type: String, required: true },
  maxGuests: { type: Number, required: true },
  city: { type: String, required: true }
});

export default model("Accomadation", AccommadationSchema);
