let exercicioSelecionado = null;

// Inicializa treino e exercícios
document.addEventListener("DOMContentLoaded", () => {
  // Obtém parâmetro ?treino=A (ou B, C, D)
  const urlParams = new URLSearchParams(window.location.search);
  const treinoID = urlParams.get("treino") || "A"; // padrão A

  const treino = window.treinos[treinoID];
  if (!treino) {
    console.error(`Treino '${treinoID}' não encontrado.`);
    return;
  }

  // Atualiza título e subtítulo
  const tituloEl = document.querySelector(".titulo");
  const subtituloEl = document.querySelector(".subtitulo");
  if (tituloEl) tituloEl.textContent = treino.titulo;
  if (subtituloEl) subtituloEl.textContent = treino.subtitulo;

  // Define os exercícios globalmente
  window.exercicios = treino.exercicios;

  // Carrega exercícios e atualiza menu de feitos
  carregarExercicios();
  atualizarMenuFeitos();
});

// Função para renderizar exercícios na tela
function carregarExercicios() {
  const lista = document.getElementById("lista-exercicios");
  lista.innerHTML = "";

  window.exercicios.forEach((ex) => {
    const divEx = document.createElement("div");
    divEx.classList.add("exercicio");
    divEx.id = `exercicio-${ex.id}`;

    // Header
    const header = document.createElement("div");
    header.classList.add("exercicio-header");
    header.innerHTML = `<span>${ex.nome}</span><span style="color:${ex.corStatus}">${ex.status}</span>`;
    divEx.appendChild(header);

    // Imagem
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("exercicio-img", ex.imgClass);
    imgDiv.onclick = () => abrirPopup(imgDiv);
    divEx.appendChild(imgDiv);

    // Footer
    const footer = document.createElement("div");
    footer.classList.add("exercicio-footer");
    footer.innerHTML = `<span>Ser: ${ex.repeticoes}</span><span>${ex.verificarPeso}</span>`;
    divEx.appendChild(footer);

    lista.appendChild(divEx);
  });
}

// POPUP: abrir e fechar
function abrirPopup(elemento) {
  exercicioSelecionado = elemento.closest(".exercicio");
  if (!exercicioSelecionado) return;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popup").style.display = "block";
}

function fecharPopup() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("popup").style.display = "none";
}

// Marcar exercício como feito
function marcarFeito() {
  if (!exercicioSelecionado) return;

  const status = exercicioSelecionado.querySelector(
    ".exercicio-header span:last-child"
  );
  status.textContent = "FEITO";
  status.style.color = "green";

  if (!exercicioSelecionado.dataset.index) {
    const lista = document.getElementById("lista-exercicios");
    const index = Array.from(lista.children).indexOf(exercicioSelecionado);
    exercicioSelecionado.dataset.index = index;
  }

  exercicioSelecionado.dataset.lista = "feitos";

  Array.from(exercicioSelecionado.children).forEach((child) => {
    if (!child.classList.contains("exercicio-header")) {
      child.style.display = "none";
    }
  });

  const header = exercicioSelecionado.querySelector(".exercicio-header");
  header.style.cursor = "pointer";
  header.addEventListener("click", () => abrirPopup(header));

  const listaFeitos = document.getElementById("lista-exercicios-feitos");
  listaFeitos.appendChild(exercicioSelecionado);

  fecharPopup();
  atualizarMenuFeitos();

  // ✅ Check se todos exercícios foram feitos
  if (checarTodosFeitos()) {
    setTimeout(() => {
      alert("🎉 Parabéns! Você concluiu todos os exercícios!");
      window.location.href = "../index.html"; // ou ajuste o caminho conforme necessário
    }, 300); // Pequena pausa para permitir o update visual
  }
}

// Desmarcar exercício feito
function marcarDesfeito() {
  if (!exercicioSelecionado) return;

  const status = exercicioSelecionado.querySelector(
    ".exercicio-header span:last-child"
  );
  status.textContent = "FAZER";
  status.style.color = "red";

  if (exercicioSelecionado.dataset.lista === "feitos") {
    const listaNormais = document.getElementById("lista-exercicios");
    const indexOriginal = parseInt(exercicioSelecionado.dataset.index);
    exercicioSelecionado.dataset.lista = "normais";

    Array.from(exercicioSelecionado.children).forEach((child) => {
      child.style.display = "";
    });

    const header = exercicioSelecionado.querySelector(".exercicio-header");
    header.style.cursor = "";
    header.replaceWith(header.cloneNode(true));

    const filhos = Array.from(listaNormais.children);
    if (indexOriginal >= filhos.length) {
      listaNormais.appendChild(exercicioSelecionado);
    } else {
      listaNormais.insertBefore(exercicioSelecionado, filhos[indexOriginal]);
    }
  }

  fecharPopup();
  atualizarMenuFeitos();
}

// Menu de feitos
function atualizarMenuFeitos() {
  const listaFeitos = document.getElementById("lista-exercicios-feitos");
  const menuFeitos = document.querySelector(".menu-feitos");
  menuFeitos.style.display =
    listaFeitos.children.length === 0 ? "none" : "block";
}

function toggleFeitos() {
  const listaFeitos = document.getElementById("lista-exercicios-feitos");
  listaFeitos.style.display =
    window.getComputedStyle(listaFeitos).display === "none" ? "block" : "none";
}

function checarTodosFeitos() {
  const todosExercicios = document.querySelectorAll(
    "#lista-exercicios .exercicio"
  );
  return todosExercicios.length === 0; // Se não sobrou nenhum na lista normal
}

