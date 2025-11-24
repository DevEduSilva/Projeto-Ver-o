let exercicioSelecionado = null;

// Carrega exercícios no HTML
function carregarExercicios() {
    const lista = document.getElementById("lista-exercicios");
    lista.innerHTML = "";

    exercicios.forEach(ex => {
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

// Abre o popup
function abrirPopup(elemento) {
    exercicioSelecionado = elemento.closest(".exercicio");
    if (!exercicioSelecionado) return;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
}

// Fecha o popup
function fecharPopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
}

// Marca exercício como feito
function marcarFeito() {
    if (!exercicioSelecionado) return;

    const status = exercicioSelecionado.querySelector(".exercicio-header span:last-child");
    status.textContent = "FEITO";
    status.style.color = "green";

    if (!exercicioSelecionado.dataset.index) {
        const lista = document.getElementById("lista-exercicios");
        const index = Array.from(lista.children).indexOf(exercicioSelecionado);
        exercicioSelecionado.dataset.index = index;
    }

    exercicioSelecionado.dataset.lista = "feitos";

    // Oculta tudo exceto o header
    Array.from(exercicioSelecionado.children).forEach(child => {
        if (!child.classList.contains("exercicio-header")) {
            child.style.display = "none";
        }
    });

    // Adiciona clique no header para abrir popup
    const header = exercicioSelecionado.querySelector(".exercicio-header");
    header.style.cursor = "pointer";
    header.addEventListener("click", () => abrirPopup(header));

    const listaFeitos = document.getElementById("lista-exercicios-feitos");
    listaFeitos.appendChild(exercicioSelecionado);

    fecharPopup();
    atualizarMenuFeitos();
}

// Desmarca exercício feito
function marcarDesfeito() {
    if (!exercicioSelecionado) return;

    const status = exercicioSelecionado.querySelector(".exercicio-header span:last-child");
    status.textContent = "FAZER";
    status.style.color = "red";

    if (exercicioSelecionado.dataset.lista === "feitos") {
        const listaNormais = document.getElementById("lista-exercicios");
        const indexOriginal = parseInt(exercicioSelecionado.dataset.index);
        exercicioSelecionado.dataset.lista = "normais";

        Array.from(exercicioSelecionado.children).forEach(child => {
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

// Atualiza menu de feitos (lista retraída)
function atualizarMenuFeitos() {
    const listaFeitos = document.getElementById("lista-exercicios-feitos");
    const menuFeitos = document.querySelector(".menu-feitos");

    if (listaFeitos.children.length === 0) {
        menuFeitos.style.display = "none";
    } else {
        menuFeitos.style.display = "block";
    }
}

// Alterna visibilidade da lista de feitos
function toggleFeitos() {
    const listaFeitos = document.getElementById("lista-exercicios-feitos");
    const atual = window.getComputedStyle(listaFeitos).display;
    listaFeitos.style.display = (atual === "none") ? "block" : "none";
}

// Confirma se a pessoa quer sair/recarregar a página
window.addEventListener("beforeunload", (e) => {
    const listaFeitos = document.getElementById("lista-exercicios-feitos");
    if (listaFeitos.children.length > 0) {
        e.preventDefault();
        e.returnValue = "";
    }
});

// Inicializa
window.addEventListener("DOMContentLoaded", () => {
    carregarExercicios();
    atualizarMenuFeitos();
});
