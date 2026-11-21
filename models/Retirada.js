import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  especieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Especie",
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { _id: false });

const retiradaSchema = new mongoose.Schema({
  municipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Municipe",
    required: true
  },
  especieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Especie",
    required: function () {
      return !this.itens || this.itens.length === 0;
    }
  },
  quantidade: {
    type: Number,
    min: 1,
    required: function () {
      return !this.itens || this.itens.length === 0;
    }
  },
  itens: {
    type: [itemSchema],
    default: undefined
  },
  dataRetirada: {
    type: Date,
    required: true,
    default: Date.now
  },
  situacao: {
    type: String,
    required: true,
    enum: ["Concluída", "Cancelada"],
    default: "Concluída"
  }
});

export default mongoose.model("Retirada", retiradaSchema);
