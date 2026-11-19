import express from "express";
import { conectarBanco } from "./config/conexao.js";
import Municipe from "./models/Municipe.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const integrantes = ["Roger Morony Martins"];

app.get("/", (req, res) => {
  res.render("index", { titulo: "Painel inicial", integrantes });
});

app.get("/municipes/add", (req, res) => {
  res.render("municipes/add", {
    titulo: "Cadastrar Munícipe"
  });
});

app.post("/municipes/add", async (req, res) => {
  try {
    const {
      nome,
      cpf,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro
    } = req.body;

    await Municipe.create({
      nome,
      cpf,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro
    });

    res.render("municipes/addok", {
      titulo: "Cadastro realizado",
      nome
    });

  } catch (erro) {
    console.error("Erro ao cadastrar munícipe:", erro);
    res.status(400).send("Não foi possível realizar o cadastro. Verifique os dados informados.");
  }
});

await conectarBanco();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SisMudas em execução: http://localhost:${PORT}`);
});
