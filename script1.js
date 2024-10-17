// Adiciona eventos
document.getElementById("add-block-btn").addEventListener("click", function () {
  const name = document.getElementById("block-name").value; // Campo nome
  const number = document.getElementById("block-number").value;
  const note = document.getElementById("block-note").value;
  const priority = document.getElementById("block-priority").value;

  if (name && number && note) {
    // Verifica se o bloco já existe
    const existingBlock = checkIfBlockExists(name, number);
    if (!existingBlock) {
      addBlockToColumn("backlog", name, number, note, priority);
      saveBlocksToStorage(); // Salva os blocos após adicionar
    } else {
      alert("Este bloco já existe.");
    }
  } else {
    alert("Por favor, preencha todos os campos");
  }
});

// Função para verificar se o bloco já existe
function checkIfBlockExists(name, number) {
  const blocks = document.querySelectorAll("#backlog .block");
  return Array.from(blocks).some((block) => {
    const blockName = block
      .querySelector("p:nth-child(1)")
      .textContent.replace("Nome: ", "");
    const blockNumber = block
      .querySelector("p:nth-child(2)")
      .textContent.replace("Número: ", "");
    return blockName === name && blockNumber === number;
  });
}

function addBlockToColumn(columnId, name, number, note, priority) {
  const column = document
    .getElementById(columnId)
    .querySelector(".block-container");

  const block = document.createElement("div");
  block.classList.add("block", priority);

  block.innerHTML = `
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Número:</strong> ${number}</p>
            <p><strong>Anotações:</strong> ${note}</p>
            <p><strong>Prioridade:</strong> ${priority}</p>
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Excluir</button>
        `;

  block.draggable = true;
  block.addEventListener("dragstart", dragStart);
  block.addEventListener("dragend", dragEnd);

  // Adiciona evento de edição
  block
    .querySelector(".edit-btn")
    .addEventListener("click", () =>
      editBlock(block, name, number, note, priority)
    );

  // Adiciona evento de exclusão
  block.querySelector(".delete-btn").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir este bloco?")) {
      block.remove();
      saveBlocksToStorage(); // Salva os blocos após a exclusão
    }
  });

  column.appendChild(block);
  saveBlocksToStorage(); // Salva os blocos após adicionar
}

// Editar bloco
function editBlock(block, name, number, note, priority) {
  const blockContent = `
            <input type="text" value="${name}" class="edit-name" placeholder="Nome">
            <input type="text" value="${number}" class="edit-number" placeholder="Número">
            <textarea class="edit-note" placeholder="Anotações">${note}</textarea>
            <select class="edit-priority">
                <option value="low" ${
                  priority === "low" ? "selected" : ""
                }>Baixa</option>
                <option value="medium" ${
                  priority === "medium" ? "selected" : ""
                }>Média</option>
                <option value="high" ${
                  priority === "high" ? "selected" : ""
                }>Alta</option>
            </select>
            <button class="save-btn">Salvar</button>
            <button class="delete-btn">Excluir</button>
        `;

  block.innerHTML = blockContent;

  block.querySelector(".save-btn").addEventListener("click", () => {
    const newName = block.querySelector(".edit-name").value;
    const newNumber = block.querySelector(".edit-number").value;
    const newNote = block.querySelector(".edit-note").value;
    const newPriority = block.querySelector(".edit-priority").value;

    block.innerHTML = `
                <p><strong>Nome:</strong> ${newName}</p>
                <p><strong>Número:</strong> ${newNumber}</p>
                <p><strong>Anotações:</strong> ${newNote}</p>
                <p><strong>Prioridade:</strong> ${newPriority}</p>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
            `;

    block.className = "block " + newPriority;

    block
      .querySelector(".edit-btn")
      .addEventListener("click", () =>
        editBlock(block, newName, newNumber, newNote, newPriority)
      );

    block.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Tem certeza que deseja excluir este bloco?")) {
        block.remove();
        saveBlocksToStorage(); // Salva após a exclusão
      }
    });

    saveBlocksToStorage(); // Salva após a edição
  });

  block.querySelector(".delete-btn").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir este bloco?")) {
      block.remove();
      saveBlocksToStorage(); // Salva após a exclusão
    }
  });
}

// Função para salvar os blocos no localStorage
function saveBlocksToStorage() {
  const columnContainers = document.querySelectorAll(".block-container");
  const data = {};

  columnContainers.forEach((column) => {
    const columnId = column.parentElement.id; // ID da coluna (Ex: backlog, to-do)
    const blocks = column.querySelectorAll(".block");
    const blocksData = [];

    blocks.forEach((block) => {
      const name = block
        .querySelector("p:nth-child(1)")
        .textContent.replace("Nome: ", "");
      const number = block
        .querySelector("p:nth-child(2)")
        .textContent.replace("Número: ", "");
      const note = block
        .querySelector("p:nth-child(3)")
        .textContent.replace("Anotações: ", "");
      const priority = block
        .querySelector("p:nth-child(4)")
        .textContent.replace("Prioridade: ", "");

      blocksData.push({ name, number, note, priority });
    });

    data[columnId] = blocksData; // Armazena os blocos por coluna
  });

  localStorage.setItem("kanbanData", JSON.stringify(data));
}

// Função para carregar blocos do localStorage
function loadBlocksFromStorage() {
  const data = JSON.parse(localStorage.getItem("kanbanData"));

  if (data) {
    Object.keys(data).forEach((columnId) => {
      data[columnId].forEach((block) => {
        addBlockToColumn(
          columnId,
          block.name,
          block.number,
          block.note,
          block.priority
        );
      });
    });
  }
}

// Carrega blocos do localStorage ao iniciar
window.addEventListener("load", () => {
  loadBlocksFromStorage();
});

// Drag & Drop
const columnContainers = document.querySelectorAll(".block-container");

columnContainers.forEach((column) => {
  column.addEventListener("dragover", dragOver);
  column.addEventListener("drop", drop);
});

let draggedItem = null;

function dragStart() {
  draggedItem = this;
  setTimeout(() => (this.style.display = "none"), 0);
}

function dragEnd() {
  setTimeout(() => {
    this.style.display = "block";
    draggedItem = null;
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
}

function drop() {
  if (draggedItem) {
    this.appendChild(draggedItem);
    saveBlocksToStorage(); // Salva após arrastar e soltar
  }
}
// Função para permitir arrastar o formulário
let isDragging = false;
let offsetLeft, offsetTop;

// Obtenha o elemento do formulário e o cabeçalho
const addBlockForm = document.querySelector(".add-block");
const header = addBlockForm.querySelector(".header");

// Obtenha a posição original do mouse em relação ao cabeçalho
header.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetLeft = e.clientX - addBlockForm.getBoundingClientRect().left;
  offsetTop = e.clientY - addBlockForm.getBoundingClientRect().top;

  // Evita que o texto seja selecionado enquanto arrasta
  e.preventDefault();
});

// Durante o arrasto
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    addBlockForm.style.left = e.clientX - offsetLeft + "px";
    addBlockForm.style.top = e.clientY - offsetTop + "px";
  }
});

// Para o arrasto
document.addEventListener("mouseup", () => {
  isDragging = false;
});
// Função para habilitar a edição do título
function editTitle(element) {
  const currentTitle = element.querySelector("h2").textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentTitle;
  input.classList.add("edit-title-input");

  // Quando o usuário pressiona Enter ou sai do campo, salvar o novo título
  input.addEventListener("blur", function () {
    saveTitle(input, element);
  });
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveTitle(input, element);
    }
  });

  // Substituir o conteúdo do título, mantendo os outros elementos do "element"
  const h2 = element.querySelector("h2");
  h2.textContent = ""; // Limpa o texto atual sem remover o <h2>
  h2.appendChild(input); // Adicionar o campo de input dentro do <h2>
  input.focus(); // Focar no campo de input
}

// Função para salvar o título editado
function saveTitle(input, element) {
  const newTitle = input.value.trim();

  if (newTitle !== "") {
    element.querySelector("h2").textContent = newTitle; // Atualizar o texto do título
  } else {
    element.querySelector("h2").textContent = "Título Padrão"; // Texto padrão, caso fique vazio
  }
}
function exportToExcel(columnId) {
  const column = document.getElementById(columnId);
  if (!column) {
    alert(`Elemento com ID ${columnId} não encontrado.`);
    return;
  }

  const blocks = column.querySelectorAll(".block");
  const data = [];
  data.push(["Nome", "Número", "Anotações", "Prioridade"]);

  const getDataFromBlock = (block) => {
    const name = block
      .querySelector("p:nth-child(1)")
      .textContent.replace("Nome: ", "");
    const number = block
      .querySelector("p:nth-child(2)")
      .textContent.replace("Número: ", "");
    const note = block
      .querySelector("p:nth-child(3)")
      .textContent.replace("Anotações: ", "");
    const priority = block
      .querySelector("p:nth-child(4)")
      .textContent.replace("Prioridade: ", "");
    return [name, number, note, priority];
  };

  blocks.forEach((block) => {
    data.push(getDataFromBlock(block));
  });

  if (data.length > 0) {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    XLSX.writeFile(workbook, `${columnId}_dados.xlsx`);
  } else {
    alert("A coluna está vazia.");
  }
}
// site.js

// Verifica se o usuário está autenticado
if (localStorage.getItem("isAuthenticated") !== "true") {
  // Se não estiver autenticado, redireciona para a página de login
  window.location.href = "login.html";
}

// Função de logout
document.getElementById("logout-btn").addEventListener("click", function () {
  // Remove a autenticação
  localStorage.removeItem("isAuthenticated");
  // Redireciona para a página de login
  window.location.href = "login.html";
});
// site.js
if (localStorage.getItem("isAuthenticated") !== "true") {
  // Se não estiver autenticado, redireciona para a página de login
  window.location.href = "login.html";
}
