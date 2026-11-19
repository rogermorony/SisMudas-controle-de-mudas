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
    titulo: "Cadastrar Munícipe",
    erro: null,
    dados: {},
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
      bairro,
    } = req.body;

    await Municipe.create({
      nome,
      cpf,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
    });

    res.render("municipes/addok", {
      titulo: "Cadastro realizado",
      nome,
    });
  } catch (erro) {
    if (erro.code === 11000) {
      return res.status(409).render("municipes/add", {
        titulo: "Cadastrar Munícipe",
        erro: "Este CPF já está cadastrado no sistema.",
        dados: req.body,
      });
    }

    console.error("Erro ao cadastrar munícipe:", erro.name);

    res.status(400).render("municipes/add", {
      titulo: "Cadastrar Munícipe",
      erro: "Não foi possível realizar o cadastro. Verifique os dados informados.",
      dados: req.body,
    });
  }
});

app.get("/municipes/lst", async (req, res) => {
  try {
    const busca = (req.query.busca || "").trim();

    let filtro = {};

    if (busca) {
      filtro = {
        $or: [{ nome: { $regex: busca, $options: "i" } }, { cpf: busca }],
      };
    }

    const municipes = await Municipe.find(filtro);

    res.render("municipes/lst", {
      titulo: "Munícipes cadastrados",
      municipes,
      busca,
      atualizado: req.query.atualizado === "1",
    });
  } catch (erro) {
    console.error("Erro ao listar munícipes:", erro);
    res.status(500).send("Não foi possível carregar a lista de munícipes.");
  }
});

app.get("/municipes/edit/:id", async (req, res) => {
  try {
    const municipe = await Municipe.findById(req.params.id);

    if (!municipe) {
      return res.status(404).send("Munícipe não encontrado.");
    }

    res.render("municipes/edit", {
      titulo: "Editar Munícipe",
      municipe,
    });
  } catch (erro) {
    console.error("Erro ao consultar munícipe:", erro);
    res.status(400).send("Não foi possível consultar o munícipe.");
  }
});

app.post("/municipes/edit/:id", async (req, res) => {
  try {
    const { nome, telefone, cep, logradouro, numero, complemento, bairro } =
      req.body;

    const municipe = await Municipe.findByIdAndUpdate(
      req.params.id,
      {
        nome,
        telefone,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
      },
      { runValidators: true },
    );

    if (!municipe) {
      return res.status(404).send("Munícipe não encontrado.");
    }

    res.redirect("/municipes/lst?atualizado=1");
  } catch (erro) {
    console.error("Erro ao atualizar munícipe:", erro);
    res.status(400).send("Não foi possível atualizar o cadastro.");
  }
});

await conectarBanco();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SisMudas em execução: http://localhost:${PORT}`);
});
