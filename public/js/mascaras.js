const cpf = document.getElementById("cpf");
const telefone = document.getElementById("telefone");

if (cpf) {
  cpf.addEventListener("input", () => {
    let valor = cpf.value.replace(/\D/g, "").slice(0, 11);

    valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpf.value = valor;
  });
}

if (telefone) {
  telefone.addEventListener("input", () => {
    const numeros = telefone.value.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      telefone.value = numeros ? "(" + numeros : "";
      return;
    }

    const ddd = numeros.slice(0, 2);
    const restante = numeros.slice(2);

    if (restante.length <= 4) {
      telefone.value = `(${ddd}) ${restante}`;
      return;
    }

    const tamanho = restante.length > 8 ? 5 : 4;

    telefone.value = `(${ddd}) ${restante.slice(0, tamanho)}-${restante.slice(tamanho)}`;
  });
}

const cep = document.getElementById("cep");

if (cep) {
  function formatarCep() {
    let valor = cep.value.replace(/\D/g, "").slice(0, 8);

    if (valor.length > 5) {
      valor = valor.slice(0, 5) + "-" + valor.slice(5);
    }

    cep.value = valor;
  }

  cep.addEventListener("input", formatarCep);
  formatarCep();
}
