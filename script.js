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

const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];

function createParticle(x, y) {
  const particle = {
    x: x,
    y: y,
    size: Math.random() * 5 + 1,
    speedX: Math.random() * 3 - 1.5,
    speedY: Math.random() * 3 - 1.5,
  };
  particles.push(particle);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle, index) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.size > 0.2) particle.size -= 0.1; // Diminuir o tamanho do particula

    ctx.fillStyle = "rgba(72, 209, 204, 1)";
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    if (particle.size <= 0.2) {
      particles.splice(index, 1); // Remove partículas pequenas
    }
  });

  requestAnimationFrame(animateParticles);
}

canvas.addEventListener("mousemove", (event) => {
  for (let i = 0; i < 5; i++) {
    createParticle(event.x, event.y);
  }
});

animateParticles();

document.addEventListener("DOMContentLoaded", function () {
  var logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // Remove a autenticação (se necessário)
      localStorage.removeItem("isAuthenticated"); // Remove a chave de autenticação, se estiver usando

      // Redireciona para a página de login
      window.location.href = "login.html"; // Altere "login.html" para o caminho da sua página de login
    });
  }
});
