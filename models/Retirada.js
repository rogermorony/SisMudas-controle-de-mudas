import mongoose from "mongoose";

const retiradaSchema = new mongoose.Schema({
  municipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Municipe",
    required: true
  },
  especieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Especie",
    required: true
  },
  quantidade: { type: Number, required: true, min: 1 },
  dataRetirada: { type: Date, required: true, default: Date.now },
  situacao: {
    type: String,
    required: true,
    enum: ["Concluída", "Cancelada"],
    default: "Concluída"
  }
});

export default mongoose.model("Retirada", retiradaSchema);