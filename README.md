<div align="center">
  <img src="assets/sismudas-banner.png" alt="SisMudas — Sistema de controle de distribuição de mudas, com apresentação desktop e mobile" width="100%">

  <h1>SisMudas</h1>
  <p><strong>Tecnologia aplicada à gestão ambiental.</strong></p>
  <p>Sistema web para gerenciamento de munícipes, espécies e distribuição gratuita de mudas.</p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-174A35?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express-202622?style=flat-square&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/EJS-315B45?style=flat-square&logo=ejs&logoColor=white" alt="EJS">
    <img src="https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat-square&logo=bootstrap&logoColor=white" alt="Bootstrap 5">
    <img src="https://img.shields.io/badge/MongoDB_Atlas-198754?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB Atlas">
    <img src="https://img.shields.io/badge/Render-202622?style=flat-square&logo=render&logoColor=white" alt="Render">
  </p>
  <p><a href="https://sismudas.onrender.com/"><strong>Acessar demonstração online</strong></a></p>
  <p><a href="#sobre-o-projeto">Sobre</a> · <a href="#funcionalidades">Funcionalidades</a> · <a href="#fluxo-operacional">Fluxo operacional</a> · <a href="#arquitetura">Arquitetura</a> · <a href="#execução-local">Execução local</a></p>
</div>

---

## Sobre o projeto

O **SisMudas** é uma aplicação web desenvolvida a partir de uma necessidade concreta de gestão ambiental: o acompanhamento da distribuição gratuita de mudas. O projeto acadêmico foi inspirado no processo de atendimento do Jardim Botânico de Paulínia (SP), onde os registros de distribuição são mantidos em planilhas e consultados para verificar a disponibilidade de novas retiradas.

A aplicação centraliza o cadastro de munícipes, o controle de espécies e estoque e o histórico das entregas, automatizando a verificação do limite de distribuição. A proposta é tornar a consulta de informações e o acompanhamento das retiradas mais práticos, preservando as regras do processo existente.

## Funcionalidades

| Módulo | Recursos |
| --- | --- |
| **Munícipes** | Cadastro, consulta por nome ou CPF, edição e exclusão de registros, respeitando os vínculos com retiradas. |
| **Espécies** | Cadastro por nome popular e científico, controle de estoque, situação ativa ou inativa, consulta e edição. |
| **Retiradas** | Registro de entregas com múltiplas espécies, consulta ao histórico, edição e exclusão. |
| **Controle de distribuição** | Validação do limite cumulativo de cinco mudas por munícipe em 30 dias. |
| **Gestão de estoque** | Verificação de disponibilidade e ajuste das quantidades conforme registros, edições e exclusões de retiradas. |

## Fluxo operacional

A regra de distribuição permite a retirada de até **cinco mudas por munícipe em um período de 30 dias**. O sistema consulta o histórico, calcula o saldo disponível e valida a quantidade solicitada antes de concluir a operação.

Por exemplo, se um munícipe já retirou duas mudas no período, ainda poderá retirar até três, desde que haja estoque disponível.

<p align="center">
  <img src="assets/sismudas-fluxograma.png" alt="Fluxograma de identificação do munícipe, consulta ao histórico, decisão de elegibilidade e registro da distribuição" width="560">
</p>

## Interface e responsividade

O front-end utiliza EJS e Bootstrap 5, com uma identidade visual em tons de verde e uma estrutura de navegação organizada em três módulos. A interface adapta a disposição de cartões e formulários a diferentes tamanhos de tela, com rolagem horizontal nas tabelas quando necessário.

A apresentação visual na abertura ilustra a experiência desktop e mobile do projeto. Para consultar as interfaces em funcionamento, acesse a [demonstração online](https://sismudas.onrender.com/).

## Arquitetura

A aplicação utiliza renderização de páginas no servidor com EJS, rotas HTTP implementadas em Express e persistência de dados no MongoDB Atlas por meio do Mongoose. O deploy é realizado no Render.

<p align="center">
  <img src="assets/sismudas-arquitetura.png" alt="Visão conceitual das tecnologias e camadas da aplicação: navegador, apresentação, aplicação e banco de dados" width="560">
</p>

| Tecnologia | Responsabilidade |
| --- | --- |
| Node.js | Ambiente de execução JavaScript no servidor. |
| Express | Rotas HTTP e processamento de requisições. |
| EJS | Renderização de templates HTML no servidor. |
| Bootstrap 5 | Componentes visuais e layout responsivo. |
| Mongoose | Modelagem e acesso ao banco de dados. |
| MongoDB Atlas | Persistência dos registros da aplicação. |
| Render | Hospedagem da aplicação web. |

## Estrutura do projeto

```text
SisMudas-controle-de-mudas/
├── assets/           # Imagens e documentação visual
├── config/           # Configuração da conexão com o banco
├── models/           # Modelos de dados
├── public/           # Arquivos estáticos
├── views/            # Templates EJS
├── .env.example      # Exemplo de configuração do ambiente
├── .gitignore
├── index.js          # Servidor e rotas da aplicação
├── package.json
├── package-lock.json
└── README.md
```

## Execução local

Pré-requisitos: Node.js 22 ou superior, npm e acesso a um banco MongoDB Atlas.

**1. Clone o repositório e instale as dependências:**

```bash
git clone https://github.com/rogermorony/SisMudas-controle-de-mudas.git
cd SisMudas-controle-de-mudas
npm ci
```

**2. Configure as variáveis de ambiente:**

Copie o arquivo `.env.example` para `.env` e substitua os valores de exemplo pelas credenciais do seu ambiente MongoDB.

```env
MONGODB_URI=mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/
DB_NAME=sismudas
PORT=3000
```

Não publique o arquivo `.env` nem credenciais reais no repositório.

**3. Inicie a aplicação:**

```bash
node --env-file=.env index.js
```

Acesse `http://localhost:3000`. O comando acima carrega explicitamente o arquivo `.env`, pois o código utiliza as variáveis de ambiente do Node.js.

## Contexto acadêmico

O SisMudas é um projeto acadêmico demonstrativo, desenvolvido na disciplina de **Desenvolvimento Back-End** do curso de Tecnologia em Sistemas para Internet do Instituto Federal Sul-rio-grandense (IFSul).

Não se trata de um sistema oficial do Jardim Botânico de Paulínia. Na demonstração pública, utilize exclusivamente dados fictícios. A aplicação não deve ser utilizada com dados pessoais reais sem os controles de segurança e privacidade apropriados.

---

<div align="center">
  <strong>Roger Morony Martins</strong><br>
  Design e desenvolvimento · IFSul · 2026<br><br>
  <a href="https://github.com/rogermorony">GitHub</a> · <a href="https://sismudas.onrender.com/">SisMudas</a>
</div>
