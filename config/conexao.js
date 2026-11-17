import mongoose from "mongoose";

// Preparado para a etapa de integração com o banco de dados.
// Nesta primeira etapa, a página inicial funciona sem uma conexão ativa.
export async function conectarBanco() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI não configurada. Defina a variável no ambiente.");
  }

  await mongoose.connect(uri, { dbName: process.env.DB_NAME || "sismudas" });
  console.log("Conectado ao MongoDB Atlas.");
}