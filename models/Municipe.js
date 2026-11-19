import mongoose from "mongoose";

const municipeSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  cpf: { type: String, required: true, trim: true, unique: true },
  telefone: { type: String, trim: true },

  cep: { type: String, required: true, trim: true },
  logradouro: { type: String, required: true, trim: true },
  numero: { type: String, required: true, trim: true },
  complemento: { type: String, trim: true },
  bairro: { type: String, required: true, trim: true },

  municipio: { type: String, required: true, default: "Paulínia", trim: true },
  ativo: { type: Boolean, required: true, default: true }
});

export default mongoose.model("Municipe", municipeSchema);
