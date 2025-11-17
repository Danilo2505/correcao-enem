// Função para buscar um arquivo SVG e inseri-lo inline no HTML
const buscarSvg = (image) => {
  // Faz uma requisição para obter o conteúdo do arquivo SVG a partir do src da imagem
  fetch(image.src)
    .then((response) => response.text()) // Converte a resposta para texto
    .then((response) => {
      const span = document.createElement("span"); // Cria um elemento <span>
      span.innerHTML = response; // Define o conteúdo do <span> como o SVG retornado
      const inlineSvg = span.getElementsByTagName("svg")[0]; // Obtém o elemento <svg>
      image.parentNode.replaceChild(inlineSvg, image); // Substitui a imagem original pelo SVG inline
      return true;
    });
};

// Função para inverter a ordem dos elementos filhos de um elemento via seletor
function inverterElementosFilhos(seletor) {
  const elementoPai = document.querySelector(seletor);

  const filhos = Array.from(elementoPai.children).reverse();

  elementoPai.replaceChildren();

  for (const filho of filhos) {
    elementoPai.appendChild(filho);
  }

  return false;
}

// Função para esconder ou mostrar um elemento via seletor
function esconderMostrarElemento(seletor, elementoChamando) {
  const elementoAlvo = document.querySelector(seletor);

  if (elementoChamando.modo == "Esconder") {
    elementoChamando.modo = "Mostrar";
    elementoChamando.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
</svg>`;
    elementoAlvo.style.display = "";
  } else {
    elementoChamando.modo = "Esconder";
    elementoChamando.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
</svg>`;
    elementoAlvo.style.display = "none";
  }
}

// Função para encontrar a melhor cor de contraste para um texto de acordo com a cor de fundo em hexadecimal
function textoContraste(corHex) {
  let r = parseInt(corHex.substr(1, 2), 16) / 255;
  let g = parseInt(corHex.substr(3, 2), 16) / 255;
  let b = parseInt(corHex.substr(5, 2), 16) / 255;

  // Correção gamma — WCAG
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  const luminancia = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminancia > 0.5 ? "#000000" : "#ffffff";
}
