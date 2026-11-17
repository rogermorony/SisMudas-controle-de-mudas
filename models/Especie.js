import mongoose from "mongoose";

const especieSchema = new mongoose.Schema({
  nomePopular: { type: String, required: true, trim: true },
  nomeCientifico: { type: String, trim: true },
  estoque: { type: Number, required: true, min: 0, default: 0 },
  ativa: { type: Boolean, required: true, default: true }
});

export default mongoose.model("Especie", especieSchema);