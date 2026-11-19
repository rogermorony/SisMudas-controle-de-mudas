import mongoose from "mongoose";

export async function conectarBanco() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI não configurada. Defina a variável no ambiente.");
  }

  await mongoose.connect(uri, { dbName: process.env.DB_NAME || "sismudas" });
  console.log("Conectado ao MongoDB Atlas.");
}