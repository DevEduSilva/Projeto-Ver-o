const menuBtn = document.getElementById("menu-btn");
const menuOpcoes = document.getElementById("menu-opcoes");
const btnToggleImagens = document.getElementById("toggle-imagens");

// Abre/fecha o menu
menuBtn.addEventListener("click", () => {
    menuOpcoes.style.display = menuOpcoes.style.display === "block" ? "none" : "block";
});

// Toggle imagens
function toggleImagens() {
    const imagens = document.querySelectorAll(".exercicio-img");
    const estaoVisiveis = imagens[0].style.display !== "none"; // verifica a primeira imagem

    imagens.forEach(img => {
        img.style.display = estaoVisiveis ? "none" : "block";
    });

    // Atualiza o texto do botão
    btnToggleImagens.textContent = estaoVisiveis ? "Mostrar imagens" : "Esconder imagens";

    // Fecha o menu
    menuOpcoes.style.display = "none";
}

// Voltar à tela inicial
function voltarInicio() {
    window.location.href = "../index.html";
}