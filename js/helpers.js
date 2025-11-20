/**
 * @file helpers.js
 * @description Conjunto de funções utilitárias usadas pela interface:
 * - Inserir SVGs inline
 * - Inverter elementos no DOM
 * - Esconder/mostrar elementos
 * - Calcular contraste ideal para textos
 */

/**
 * Faz uma requisição ao arquivo SVG e o substitui inline no DOM.
 * Útil para permitir manipulação via CSS, já que <img> não permite estilização interna.
 *
 * @function buscarSvg
 * @param {HTMLImageElement} image - Imagem cujo src aponta para o SVG.
 * @returns {Promise<boolean>} Retorna true ao concluir.
 */
const buscarSvg = (image) => {
  return fetch(image.src)
    .then((response) => response.text())
    .then((response) => {
      const span = document.createElement("span");
      span.innerHTML = response;

      const inlineSvg = span.getElementsByTagName("svg")[0];

      image.parentNode.replaceChild(inlineSvg, image);

      return true;
    });
};

/**
 * Inverte a ordem dos elementos filhos de um elemento pai.
 *
 * @function inverterElementosFilhos
 * @param {string} seletor - Seletor CSS do elemento pai.
 * @returns {boolean} Retorna false apenas para manter consistência com o padrão usado.
 */
function inverterElementosFilhos(seletor) {
  const elementoPai = document.querySelector(seletor);
  const filhos = Array.from(elementoPai.children).reverse();

  elementoPai.replaceChildren(); // Remove todos
  filhos.forEach((filho) => elementoPai.appendChild(filho));

  return false;
}

/**
 * Alterna entre esconder e mostrar um elemento usando display:none.
 * Também troca o ícone do botão chamador.
 *
 * @function esconderMostrarElemento
 * @param {string} seletor - Seletor CSS do elemento que será escondido/mostrado.
 * @param {HTMLElement} elementoChamando - Botão que dispara e guarda o estado atual.
 * @returns {void}
 */
function esconderMostrarElemento(seletor, elementoChamando) {
  const elementoAlvo = document.querySelector(seletor);

  const svgEsconder = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
      <path d="m10.79 12.912-1.614-1.615..."/>
    </svg>
  `;

  const svgMostrar = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0..."/>
    </svg>
  `;

  const esconder = elementoChamando.modo === "Mostrar";

  elementoChamando.modo = esconder ? "Esconder" : "Mostrar";
  elementoChamando.innerHTML = esconder ? svgMostrar : svgEsconder;

  elementoAlvo.style.display = esconder ? "none" : "";
}

/**
 * Calcula a cor ideal (preto ou branco) para um texto baseado na cor de fundo.
 * Segue a fórmula de luminância da WCAG.
 *
 * @function textoContraste
 * @param {string} corHex - Cor no formato hexadecimal (#RRGGBB).
 * @returns {string} "#000000" ou "#ffffff" conforme o contraste necessário.
 */
function textoContraste(corHex) {
  // Usando substring() para extrair os componentes R, G e B
  let r = parseInt(corHex.substring(1, 3), 16) / 255;
  let g = parseInt(corHex.substring(3, 5), 16) / 255;
  let b = parseInt(corHex.substring(5, 7), 16) / 255;

  // Correção gamma (padrão WCAG)
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  const luminancia = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminancia > 0.5 ? "#000000" : "#ffffff";
}
