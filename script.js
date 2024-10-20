// login.js

// Usuário e senha fictícios (substitua por sua lógica)
const USERNAME = "Felipe";
const PASSWORD = "192837";

// Função para manipular o login
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === USERNAME && password === PASSWORD) {
    // Armazena o status de login no localStorage
    localStorage.setItem("isAuthenticated", "true");
    // Redireciona para a página principal do site
    window.location.href = "site.html";
  } else {
    // Mostra mensagem de erro
    document.getElementById("error-message").textContent =
      "Usuário ou senha inválidos.";
    document.getElementById("error-message").style.visibility = "visible";
  }
});
// site.js
if (localStorage.getItem("isAuthenticated") !== "true") {
  // Se não estiver autenticado, redireciona para a página de login
  window.location.href = "login.html";
}
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  preloader.classList.add("hidden");
});
