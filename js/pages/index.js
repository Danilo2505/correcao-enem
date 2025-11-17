import { coresCadernos } from "../dados/cores-cadernos.js";
import { gabaritos } from "../dados/gabaritos.js";

function carregarCoresCadernos() {
  const selectEdicaoProva = document.querySelector("#select-edicao-prova");
  const selectCorProvaDia1 = document.querySelector("#select-cor-prova-dia-1");
  const selectCorProvaDia2 = document.querySelector("#select-cor-prova-dia-2");

  const coresCadernosDaEdicao = coresCadernos[selectEdicaoProva.value];

  selectCorProvaDia1.replaceChildren();
  selectCorProvaDia2.replaceChildren();

  for (const corCaderno of coresCadernosDaEdicao["dia_1"]) {
    const option = document.createElement("option");
    option.textContent = corCaderno;
    option.value = corCaderno;
    selectCorProvaDia1.appendChild(option);
  }
  for (const corCaderno of coresCadernosDaEdicao["dia_2"]) {
    const option = document.createElement("option");
    option.textContent = corCaderno;
    option.value = corCaderno;
    selectCorProvaDia2.appendChild(option);
  }
}

// Carrega o Formulário das Questões/Respostas
function carregarFormulario() {
  // Relações dos índices começando do 0 com as letras das alternativas
  const relacaoIndiceLetra = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
  };

  // Formulário das Questões/Respostas
  const formQuestoesRespostas = document.querySelector(
    "#form-questoes-respostas"
  );
  // Div das Questões/Respostas
  let divQuestoesRespostas;
  // Fieldsets das Áreas do Conhecimento
  const fieldsetLinguagens = formQuestoesRespostas.querySelector(
    "#fieldset-questoes-respostas-linguagens"
  );
  const fieldsetHumanas = formQuestoesRespostas.querySelector(
    "#fieldset-questoes-respostas-humanas"
  );
  const fieldsetNatureza = formQuestoesRespostas.querySelector(
    "#fieldset-questoes-respostas-natureza"
  );
  const fieldsetMatematica = formQuestoesRespostas.querySelector(
    "#fieldset-questoes-respostas-matematica"
  );

  // Loop de 1 a 180
  for (let i = 1; i < 181; i++) {
    if (i > 0 && i < 46) {
      // Linguagens, Códigos e suas Tecnologias
      divQuestoesRespostas = fieldsetLinguagens.querySelector(
        ".div-questoes-respostas"
      );
    } else if (i > 45 && i < 91) {
      // Ciências Humanas e suas Tecnologias
      divQuestoesRespostas = fieldsetHumanas.querySelector(
        ".div-questoes-respostas"
      );
    } else if (i > 90 && i < 136) {
      // Ciências da Natureza e suas Tecnologias
      divQuestoesRespostas = fieldsetNatureza.querySelector(
        ".div-questoes-respostas"
      );
    } else {
      // Matemática e suas Tecnologias
      divQuestoesRespostas = fieldsetMatematica.querySelector(
        ".div-questoes-respostas"
      );
    }

    // Cria uma <div> para ser a linha da questão e um <p> para indicar seu número
    const divLinha = document.createElement("div");
    const p = document.createElement("p");
    // Define o número da questão e coloca na linha
    p.textContent = i;
    divLinha.appendChild(p);
    // Coloca as alternativas na linha
    for (let j = 0; j < 5; j++) {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `${i}`;
      input.value = relacaoIndiceLetra[j];
      divLinha.appendChild(input);
    }

    // Adiciona a classe à divLinha e a coloca nas Questões Resposta
    divLinha.classList.add("div-linha");
    divQuestoesRespostas.appendChild(divLinha);
  }
}

function obterRespostas() {
  const formQuestoesRespostas = document.querySelector(
    "#form-questoes-respostas"
  );
  const dadosForm = new FormData(formQuestoesRespostas);

  return Object.fromEntries(dadosForm);
}

async function execucaoInicialIndex() {
  carregarCoresCadernos();
  carregarFormulario();

  const selectEdicaoProva = document.querySelector("#select-edicao-prova");
  const formQuestoesRespostas = document.querySelector(
    "#form-questoes-respostas"
  );

  selectEdicaoProva.addEventListener("change", () => {
    carregarCoresCadernos();
  });
  formQuestoesRespostas.addEventListener("change", () => {
    console.log(obterRespostas());
  });
}

execucaoInicialIndex();
