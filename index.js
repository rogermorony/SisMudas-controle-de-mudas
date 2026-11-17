import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Inclua aqui os demais integrantes se o projeto for desenvolvido em grupo.
const integrantes = ["Roger Morony Martins"];

app.get("/", (req, res) => {
  res.render("index", { titulo: "Painel inicial", integrantes });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SisMudas em execução: http://localhost:${PORT}`);
});