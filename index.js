import express from "express";
import { conectarBanco } from "./config/conexao.js";
import Municipe from "./models/Municipe.js";
import Especie from "./models/Especie.js";
import Retirada from "./models/Retirada.js";
import mongoose from "mongoose";

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
      bloqueado: req.query.bloqueado === "1",
      excluido: req.query.excluido === "1",
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

app.post("/municipes/delete/:id", async (req, res) => {
  try {
    const retirada = await Retirada.findOne({
      municipeId: req.params.id,
    });

    if (retirada) {
      return res.redirect("/municipes/lst?bloqueado=1");
    }

    await Municipe.findByIdAndDelete(req.params.id);
    res.redirect("/municipes/lst?excluido=1");
  } catch (erro) {
    console.error("Erro ao excluir munícipe:", erro);
    res.redirect("/municipes/lst?bloqueado=1");
  }
});

app.get("/especies/add", (req, res) => {
  res.render("especies/add", {
    titulo: "Cadastrar Espécie",
  });
});

app.post("/especies/add", async (req, res) => {
  try {
    const { nomePopular, nomeCientifico, estoque, ativa } = req.body;

    await Especie.create({
      nomePopular,
      nomeCientifico,
      estoque,
      ativa: ativa === "true",
    });

    res.render("especies/addok", {
      titulo: "Espécie cadastrada",
      nomePopular,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar espécie:", erro);
    res.status(400).send("Não foi possível cadastrar a espécie.");
  }
});

app.get("/especies/lst", async (req, res) => {
  try {
    const busca = (req.query.busca || "").trim();

    let filtro = {};

    if (busca) {
      filtro = {
        $or: [
          { nomePopular: { $regex: busca, $options: "i" } },
          { nomeCientifico: { $regex: busca, $options: "i" } },
        ],
      };
    }

    const especies = await Especie.find(filtro);

    res.render("especies/lst", {
      titulo: "Espécies cadastradas",
      especies,
      busca,
      atualizado: req.query.atualizado === "1",
      bloqueado: req.query.bloqueado === "1",
      excluido: req.query.excluido === "1",
      erroExclusao: req.query.erroExclusao === "1",
    });
  } catch (erro) {
    console.error("Erro ao listar espécies:", erro);
    res.status(500).send("Não foi possível carregar a lista de espécies.");
  }
});

app.get("/especies/edit/:id", async (req, res) => {
  try {
    const especie = await Especie.findById(req.params.id);

    if (!especie) {
      return res.status(404).send("Espécie não encontrada.");
    }

    res.render("especies/edit", {
      titulo: "Editar Espécie",
      especie,
    });
  } catch (erro) {
    console.error("Erro ao consultar espécie:", erro);
    res.status(400).send("Não foi possível consultar a espécie.");
  }
});

app.post("/especies/edit/:id", async (req, res) => {
  try {
    const { nomePopular, nomeCientifico, estoque, ativa } = req.body;

    const especie = await Especie.findByIdAndUpdate(
      req.params.id,
      {
        nomePopular,
        nomeCientifico,
        estoque,
        ativa: ativa === "true",
      },
      { runValidators: true },
    );

    if (!especie) {
      return res.status(404).send("Espécie não encontrada.");
    }

    res.redirect("/especies/lst?atualizado=1");
  } catch (erro) {
    console.error("Erro ao atualizar espécie:", erro);
    res.status(400).send("Não foi possível atualizar a espécie.");
  }
});

app.post("/especies/delete/:id", async (req, res) => {
  try {
    const retirada = await Retirada.findOne({
      $or: [{ especieId: req.params.id }, { "itens.especieId": req.params.id }],
    });

    if (retirada) {
      return res.redirect("/especies/lst?bloqueado=1");
    }

    const especie = await Especie.findByIdAndDelete(req.params.id);

    if (!especie) {
      return res.redirect("/especies/lst?erroExclusao=1");
    }

    res.redirect("/especies/lst?excluido=1");
  } catch (erro) {
    console.error("Erro ao excluir espécie:", erro);
    res.redirect("/especies/lst?erroExclusao=1");
  }
});

app.get("/retiradas/add", async (req, res) => {
  try {
    const municipes = await Municipe.find({ ativo: true });
    const especies = await Especie.find({
      ativa: true,
      estoque: { $gt: 0 },
    });

    res.render("retiradas/add", {
      titulo: "Registrar Retirada",
      municipes,
      especies,
      erro: null,
    });
  } catch (erro) {
    console.error("Erro ao carregar retiradas:", erro);
    res.status(500).send("Não foi possível carregar o formulário.");
  }
});

app.post("/retiradas/add", async (req, res) => {
  try {
    const { municipeId } = req.body;
    const especieIds = req.body.especieIds || [];
    const quantidades = req.body.quantidades || [];

    const itens = [];
    let total = 0;
    let erro = null;

    for (let i = 0; i < especieIds.length; i++) {
      const especieId = especieIds[i];
      const valor = quantidades[i];

      if (!especieId && !valor) {
        continue;
      }

      const quantidade = Number(valor);

      if (
        !especieId ||
        !valor ||
        !Number.isInteger(quantidade) ||
        quantidade < 1 ||
        quantidade > 5
      ) {
        erro = "Informe uma espécie e uma quantidade válida.";
        break;
      }

      itens.push({ especieId, quantidade });
      total += quantidade;
    }

    if (!erro && itens.length === 0) {
      erro = "Selecione pelo menos uma espécie.";
    }

    if (!erro && total > 5) {
      erro = "O limite é de 5 mudas por retirada.";
    }

    const ids = itens.map((item) => item.especieId);

    if (!erro && new Set(ids).size !== ids.length) {
      erro = "Não selecione a mesma espécie mais de uma vez.";
    }

    let municipe;

    if (!erro) {
      municipe = await Municipe.findOne({
        _id: municipeId,
        ativo: true,
      });

      if (!municipe) {
        erro = "Munícipe não encontrado.";
      }
    }

    if (!erro) {
      const limite = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const retiradasAnteriores = await Retirada.find({
        municipeId,
        situacao: "Concluída",
        dataRetirada: { $gt: limite },
      });

      let totalRetirado = 0;

      for (const retirada of retiradasAnteriores) {
        if (retirada.itens && retirada.itens.length > 0) {
          for (const item of retirada.itens) {
            totalRetirado += item.quantidade;
          }
        } else {
          totalRetirado += retirada.quantidade || 0;
        }
      }

      const disponivel = 5 - totalRetirado;

      if (total > disponivel) {
        erro = `Este munícipe já retirou ${totalRetirado} muda(s) nos últimos 30 dias. Limite disponível: ${disponivel} muda(s).`;
      }
    }

    if (!erro) {
      const baixados = [];
      const nomes = [];

      try {
        for (const item of itens) {
          const especie = await Especie.findOneAndUpdate(
            {
              _id: item.especieId,
              ativa: true,
              estoque: { $gte: item.quantidade },
            },
            {
              $inc: { estoque: -item.quantidade },
            },
          );

          if (!especie) {
            erro = "Uma das espécies não possui estoque suficiente.";
            break;
          }

          baixados.push(item);
          nomes.push(especie.nomePopular);
        }

        if (!erro) {
          await Retirada.create({
            municipeId,
            itens,
          });
        }
      } catch (falha) {
        console.error("Erro ao salvar retirada:", falha);
        erro = "Não foi possível registrar a retirada.";
      }

      if (erro) {
        for (const item of baixados) {
          await Especie.findByIdAndUpdate(item.especieId, {
            $inc: { estoque: item.quantidade },
          });
        }
      } else {
        return res.render("retiradas/addok", {
          titulo: "Retirada registrada",
          nome: municipe.nome,
          especie: nomes.join(", "),
          quantidade: total,
        });
      }
    }

    const municipes = await Municipe.find({ ativo: true });
    const especies = await Especie.find({
      ativa: true,
      estoque: { $gt: 0 },
    });

    res.status(400).render("retiradas/add", {
      titulo: "Registrar Retirada",
      municipes,
      especies,
      erro,
    });
  } catch (erro) {
    console.error("Erro ao registrar retirada:", erro);
    res.status(400).send("Não foi possível registrar a retirada.");
  }
});

app.get("/retiradas/lst", async (req, res) => {
  try {
    const busca = (req.query.busca || "").trim();

    let filtro = {};

    if (busca) {
      const municipes = await Municipe.find({
        nome: { $regex: busca, $options: "i" },
      });

      filtro = {
        municipeId: { $in: municipes.map((m) => m._id) },
      };
    }

    const retiradas = await Retirada.find(filtro)
      .populate("municipeId", "nome")
      .populate("especieId", "nomePopular")
      .populate("itens.especieId", "nomePopular")
      .sort({ dataRetirada: -1 });

    res.render("retiradas/lst", {
      titulo: "Histórico de Retiradas",
      retiradas,
      busca,
      excluido: req.query.excluido === "1",
      erroExclusao: req.query.erroExclusao === "1",
      atualizado: req.query.atualizado === "1",
    });
  } catch (erro) {
    console.error("Erro ao listar retiradas:", erro);
    res.status(500).send("Não foi possível carregar o histórico de retiradas.");
  }
});

app.post("/retiradas/delete/:id", async (req, res) => {
  try {
    await mongoose.connection.transaction(async (session) => {
      const retirada = await Retirada.findById(req.params.id).session(session);

      if (!retirada) {
        throw new Error("Retirada não encontrada.");
      }

      if (retirada.situacao === "Concluída") {
        const itens = retirada.itens?.length
          ? retirada.itens
          : [
              {
                especieId: retirada.especieId,
                quantidade: retirada.quantidade,
              },
            ];

        for (const item of itens) {
          const resultado = await Especie.updateOne(
            { _id: item.especieId },
            { $inc: { estoque: item.quantidade } },
            { session },
          );

          if (resultado.matchedCount !== 1) {
            throw new Error("Espécie não encontrada no estoque.");
          }
        }
      }

      await Retirada.findByIdAndDelete(retirada._id, { session });
    });

    res.redirect("/retiradas/lst?excluido=1");
  } catch (erro) {
    console.error("Erro ao excluir retirada:", erro);
    res.redirect("/retiradas/lst?erroExclusao=1");
  }
});

app.get("/retiradas/edit/:id", async (req, res) => {
  try {
    const retirada = await Retirada.findById(req.params.id).populate(
      "municipeId",
      "nome cpf",
    );

    if (!retirada) {
      return res.status(404).send("Retirada não encontrada.");
    }

    if (retirada.situacao !== "Concluída") {
      return res.status(400).send("Esta retirada não pode ser editada.");
    }

    const itensAtuais = (
      retirada.itens?.length
        ? retirada.itens
        : [
            {
              especieId: retirada.especieId,
              quantidade: retirada.quantidade,
            },
          ]
    ).map((item) => ({
      especieId: String(item.especieId),
      quantidade: item.quantidade,
    }));

    const especies = await Especie.find({
      $or: [
        { ativa: true, estoque: { $gt: 0 } },
        { _id: { $in: itensAtuais.map((item) => item.especieId) } },
      ],
    }).sort({ nomePopular: 1 });

    const mensagens = {
      dados: "Verifique as espécies e quantidades informadas.",
      limite: "O limite é de 5 mudas por período de 30 dias.",
      estoque:
        "Uma das espécies está inativa ou não possui estoque suficiente.",
      falha: "Não foi possível atualizar a retirada.",
    };

    res.render("retiradas/edit", {
      titulo: "Editar Retirada",
      retirada,
      itensAtuais,
      especies,
      erro: mensagens[req.query.erro] || null,
    });
    
  } catch (erro) {
    console.error("Erro ao carregar retirada:", erro);
    res.status(400).send("Não foi possível carregar a retirada.");
  }
});

app.post("/retiradas/edit/:id", async (req, res) => {
  const voltar = (erro) => {
    res.redirect(`/retiradas/edit/${req.params.id}?erro=${erro}`);
  };

  const especieIds = req.body.especieIds || [];
  const quantidades = req.body.quantidades || [];
  const itens = [];
  let total = 0;

  for (let i = 0; i < especieIds.length; i++) {
    const especieId = especieIds[i];
    const valor = quantidades[i];

    if (!especieId && !valor) {
      continue;
    }

    const quantidade = Number(valor);

    if (
      !mongoose.isValidObjectId(especieId) ||
      !valor ||
      !Number.isInteger(quantidade) ||
      quantidade < 1 ||
      quantidade > 5
    ) {
      return voltar("dados");
    }

    itens.push({ especieId, quantidade });
    total += quantidade;
  }

  const ids = itens.map((item) => item.especieId);

  if (itens.length === 0 || total > 5 || new Set(ids).size !== ids.length) {
    return voltar("dados");
  }

  try {
    await mongoose.connection.transaction(async (session) => {
      const retirada = await Retirada.findById(req.params.id).session(session);

      if (!retirada || retirada.situacao !== "Concluída") {
        throw new Error("retirada");
      }

      const anteriores = retirada.itens?.length
        ? retirada.itens
        : [
            {
              especieId: retirada.especieId,
              quantidade: retirada.quantidade,
            },
          ];

      const periodo = 30 * 24 * 60 * 60 * 1000;
      const data = retirada.dataRetirada.getTime();

      const outras = await Retirada.find({
        _id: { $ne: retirada._id },
        municipeId: retirada.municipeId,
        situacao: "Concluída",
        dataRetirada: {
          $gt: new Date(data - periodo),
          $lt: new Date(data + periodo),
        },
      }).session(session);

      const historico = outras.map((registro) => ({
        data: registro.dataRetirada.getTime(),
        total: registro.itens?.length
          ? registro.itens.reduce((soma, item) => soma + item.quantidade, 0)
          : registro.quantidade || 0,
      }));

      historico.push({ data, total });

      for (const registro of historico) {
        const totalPeriodo = historico
          .filter(
            (item) =>
              item.data <= registro.data && item.data > registro.data - periodo,
          )
          .reduce((soma, item) => soma + item.total, 0);

        if (totalPeriodo > 5) {
          throw new Error("limite");
        }
      }

      const estoqueAnterior = new Map();
      const estoqueNovo = new Map();

      for (const item of anteriores) {
        const id = String(item.especieId);
        estoqueAnterior.set(
          id,
          (estoqueAnterior.get(id) || 0) + item.quantidade,
        );
      }

      for (const item of itens) {
        estoqueNovo.set(item.especieId, item.quantidade);
      }

      const especies = new Set([
        ...estoqueAnterior.keys(),
        ...estoqueNovo.keys(),
      ]);

      for (const id of especies) {
        const quantidadeAnterior = estoqueAnterior.get(id) || 0;
        const quantidadeNova = estoqueNovo.get(id) || 0;
        const diferenca = quantidadeAnterior - quantidadeNova;

        if (diferenca === 0) {
          continue;
        }

        const filtro = { _id: id };

        if (diferenca < 0) {
          filtro.ativa = true;
          filtro.estoque = { $gte: -diferenca };
        }

        const resultado = await Especie.updateOne(
          filtro,
          { $inc: { estoque: diferenca } },
          { session },
        );

        if (resultado.matchedCount !== 1) {
          throw new Error("estoque");
        }
      }

      retirada.itens = itens;
      retirada.especieId = undefined;
      retirada.quantidade = undefined;

      await retirada.save({ session });
    });

    res.redirect("/retiradas/lst?atualizado=1");
  } catch (erro) {
    console.error("Erro ao editar retirada:", erro);

    if (erro.message === "limite") {
      return voltar("limite");
    }

    if (erro.message === "estoque") {
      return voltar("estoque");
    }

    voltar("falha");
  }
});

await conectarBanco();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SisMudas em execução: http://localhost:${PORT}`);
});
