/**
 * @file montagem-gabarito.js
 * @description
 * Funções responsáveis por montar e filtrar o gabarito final do ENEM:
 * - localizar o gabarito de uma prova pela cor;
 * - unificar Dia 1 e Dia 2 removendo anuladas e redação;
 * - ajustar respostas do formulário para inglês/espanhol.
 *
 * O objetivo é sempre retornar objetos simples e prontos para comparação.
 */

/**
 * Localiza uma prova pela cor (case-insensitive) e retorna seu gabarito.
 *
 * @function pegarGabarito
 * @param {Array<Object>} provas - Lista de provas disponíveis.
 * @param {string} provas[].cor_da_prova - Cor da prova.
 * @param {Object} provas[].gabarito - Gabarito da prova.
 * @param {string} corDesejada - Nome da cor buscada.
 * @returns {Object|null} O gabarito correspondente ou `null` se não encontrado.
 *
 * @example
 * pegarGabarito(lista, "amarelo") → { "1": "C", "2": "D", ... }
 */
export function pegarGabarito(provas, corDesejada) {
  const prova = provas.find(
    (p) => p.cor_da_prova.toLowerCase() === corDesejada.toLowerCase()
  );

  // Retorno explícito: evita undefined e facilita checagens posteriores.
  return prova ? prova.gabarito : null;
}

/**
 * Gera o gabarito final combinando Dia 1 e Dia 2.
 * Remove:
 * - questões anuladas;
 * - redação ("Red");
 * - questões cuja letra final não corresponde ao idioma selecionado.
 *
 * @function gerarGabaritoCompleto
 * @param {Object<string,string>} gabaritoDia1 - Questão → Resposta.
 * @param {Object<string,string>} gabaritoDia2 - Questão → Resposta.
 * @param {"I"|"E"} sufixoIdioma - Idioma desejado ("I" inglês, "E" espanhol).
 * @returns {Object<string,string>} Gabarito filtrado e unificado.
 *
 * @example
 * gerarGabaritoCompleto(g1, g2, "I") → gabarito apenas de inglês.
 */
export function gerarGabaritoCompleto(
  gabaritoDia1,
  gabaritoDia2,
  sufixoIdioma
) {
  return Object.fromEntries(
    Object.entries({ ...gabaritoDia1, ...gabaritoDia2 }).filter(
      ([key, value]) => {
        // Ignora anuladas e redação
        if (value === "Anulado" || key === "Red") return false;

        // Filtra questões da língua estrangeira
        if (key.endsWith("I") && sufixoIdioma !== "I") return false;
        if (key.endsWith("E") && sufixoIdioma !== "E") return false;

        return true;
      }
    )
  );
}

/**
 * Lê o formulário de respostas e aplica o sufixo de idioma (I/E)
 * para as questões 1 a 5 — que dependem do idioma escolhido.
 *
 * Exemplo:
 * - resposta 1 → vira "1I" ou "1E"
 * - remove as chaves antigas ("1", "2", "3"...)
 *
 * @function obterRespostas
 * @returns {Object<string,string>} Objeto de respostas ajustado para comparação.
 *
 * @example
 * obterRespostas() → { "1I": "B", "2I": "D", "3": "A", ... }
 */
export function obterRespostas() {
  const form = document.querySelector("#form-questoes-respostas");
  const lingua = document.querySelector("#select-lingua-estrangeira").value;

  // Inglês → "I"; Espanhol → "E"
  const sufixo = lingua === "Inglês" ? "I" : "E";

  // FormData já devolve pares chave-valor das respostas marcadas
  const respostas = Object.fromEntries(new FormData(form));

  // Questões 1–5 são específicas de idioma
  for (let i = 1; i <= 5; i++) {
    if (!respostas.hasOwnProperty(i)) continue;

    respostas[`${i}${sufixo}`] = respostas[i];
    delete respostas[i]; // remove a chave antiga
  }

  return respostas;
}
