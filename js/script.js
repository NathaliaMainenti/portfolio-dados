// 1. Função para trocar de abas (SPA - Single Page Application)
function showTab(tabId) {
    document.querySelectorAll('.container').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    window.scrollTo(0, 0);
}

// 2. Função para o Chatbot se comunicar com o Python no Render
async function enviarMensagem() {
    const input = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const pergunta = input.value.trim();

    if (!pergunta) return;

    // Adiciona a mensagem do usuário na tela
    chatWindow.innerHTML += `<div class="msg user">${pergunta}</div>`;
    input.value = "";
    input.focus();
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // --- CONEXÃO COM O BACKEND ---
    // ADICIONADO O /pergunta NO FINAL DA SUA URL
    const URL_DO_RENDER = "https://onrender.com";

    try {
        const loadingMsg = document.createElement("div");
        loadingMsg.className = "msg bot";
        loadingMsg.innerText = "Consultando arquivos Disney...";
        loadingMsg.id = "loading";
        chatWindow.appendChild(loadingMsg);

        // Faz a requisição para a sua API Python
        const response = await fetch(`${URL_DO_RENDER}?texto=${encodeURIComponent(pergunta)}`);
        
        if (!response.ok) throw new Error("Erro na resposta do servidor");

        const data = await response.json();

        document.getElementById("loading").remove();
        chatWindow.innerHTML += `<div class="msg bot">${data.resposta}</div>`;

    } catch (error) {
        if (document.getElementById("loading")) document.getElementById("loading").remove();
        chatWindow.innerHTML += `<div class="msg bot">⚠️ O servidor está acordando... Tente novamente em alguns segundos.</div>`;
    }

    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 3. Funções de controle da interface de Projetos
function openDisneyBot() {
    document.querySelector('.project-grid').style.display = 'none';
    document.getElementById('disney-bot-area').style.display = 'block';
}

function closeDisneyBot() {
    document.querySelector('.project-grid').style.display = 'grid';
    document.getElementById('disney-bot-area').style.display = 'none';
}

// 4. Atalho: Enviar mensagem ao apertar a tecla "Enter"
// Usamos window.onload para garantir que o elemento existe antes de adicionar o evento
window.onload = function() {
    const inputField = document.getElementById('user-input');
    if (inputField) {
        inputField.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                enviarMensagem();
            }
        });
    }
};

