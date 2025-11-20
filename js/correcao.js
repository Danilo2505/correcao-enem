/**
 * @file correcao.js
 * @description Funções responsáveis por corrigir as respostas do usuário
 * comparando com o gabarito e por exibir os resultados detalhados por área.
 */

import { definirDadosDivDadosAnalise } from "./ui.js";

/**
 * Corrige as respostas do usuário comparando-as com o gabarito completo.
 * Também calcula totais e acertos por área e lista erros na página.
 *
 * @function corrigir
 * @param {Object} gabaritoCompleto - Objeto com todas as questões válidas do ENEM.
 * @param {Object} respostasUsuario - Objeto com as respostas enviadas pelo usuário.
 * @param {Object} divsErros - Seletor de cada div onde erros de cada área serão exibidos.
 * @returns {Object} Estatísticas gerais e por área (total, acertos).
 */
export function corrigir(gabaritoCompleto, respostasUsuario, divsErros) {
  // Definição das áreas e suas faixas de questões
  const AREAS = [
    { nome: "linguagens", min: 1, max: 45 },
    { nome: "humanas", min: 46, max: 90 },
    { nome: "natureza", min: 91, max: 135 },
    { nome: "matematica", min: 136, max: 180 },
  ];

  // Estrutura de dados para armazenar totais e acertos
  const dados = {
    geral: { total: 0, acertos: 0 },
    linguagens: { total: 0, acertos: 0 },
    humanas: { total: 0, acertos: 0 },
    natureza: { total: 0, acertos: 0 },
    matematica: { total: 0, acertos: 0 },
  };

  /**
   * Retorna a área correspondente à questão.
   * @param {number} n - Número da questão.
   * @returns {Object|undefined} Área correspondente ou undefined.
   */
  function areaDaQuestao(n) {
    return AREAS.find((a) => n >= a.min && n <= a.max);
  }

  // Total geral de questões válidas
  dados.geral.total = Object.keys(gabaritoCompleto).length;

  // Percorre todas as questões do gabarito
  for (const key of Object.keys(gabaritoCompleto)) {
    // Remove sufixos "I" e "E" e obtém o número puro da questão
    const numero = Number(key.replace("I", "").replace("E", ""));
    const area = areaDaQuestao(numero);
    if (!area) continue;

    dados[area.nome].total++;

    const certa = gabaritoCompleto[key];
    const usuario = respostasUsuario[key];

    // Não respondeu → não conta acerto nem erro
    if (!usuario) continue;

    // Acertou
    if (usuario === certa) {
      dados.geral.acertos++;
      dados[area.nome].acertos++;
    }

    // Errou → exibir na respectiva área
    else {
      const div = document.querySelector(divsErros[area.nome]);
      const p = document.createElement("p");
      p.innerHTML = `<b>${key}</b>: certo = <b>${certa}</b>, seu = ${usuario}`;
      div.appendChild(p);
    }
  }

  return dados;
}

/**
 * Exibe os resultados finais na tela,
 * populando as divs de análise para cada área.
 *
 * @function mostrarResultados
 * @param {Object} dados - Estatísticas calculadas pela função corrigir().
 */
export function mostrarResultados(dados) {
  // Exibe dados gerais
  definirDadosDivDadosAnalise(
    "#div-analise-geral",
    dados.geral.total,
    dados.geral.acertos,
    dados.geral.total - dados.geral.acertos
  );

  // Exibe dados por área
  ["linguagens", "humanas", "natureza", "matematica"].forEach((area) => {
    const d = dados[area];
    definirDadosDivDadosAnalise(
      `#div-analise-${area}`,
      d.total,
      d.acertos,
      d.total - d.acertos
    );
  });
}
