// 1. Função para trocar de abas
function showTab(tabId) {
    document.querySelectorAll('.container').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    window.scrollTo(0, 0);
}

// 2. Função para o Chatbot se comunicar com o seu Python no Render
async function enviarMensagem() {
    const input = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const pergunta = input.value.trim();

    if (!pergunta) return;

    // Exibe a pergunta do usuário
    chatWindow.innerHTML += `<div class="msg user">${pergunta}</div>`;
    input.value = "";
    input.focus();
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // --- CONEXÃO COM O SEU BACKEND REAL ---
    const URL_DO_RENDER = "https://disney-bot-api.onrender.com/pergunta"; // Substitua pela URL real do seu backend no Render

    try {
        const loadingMsg = document.createElement("div");
        loadingMsg.className = "msg bot";
        loadingMsg.innerText = "Consultando arquivos Disney...";
        loadingMsg.id = "loading";
        chatWindow.appendChild(loadingMsg);

        // Faz a requisição exata para o seu servidor
        const response = await fetch(`${URL_DO_RENDER}?texto=${encodeURIComponent(pergunta)}`);
        
        if (!response.ok) throw new Error("Erro na resposta");

        const data = await response.json();

        if (document.getElementById("loading")) document.getElementById("loading").remove();
        
        // Exibe a resposta que o Python enviou
        chatWindow.innerHTML += `<div class="msg bot">${data.resposta}</div>`;

    } catch (error) {
        if (document.getElementById("loading")) document.getElementById("loading").remove();
        chatWindow.innerHTML += `<div class="msg bot">⚠️ O servidor está acordando... Tente novamente em 30 segundos.</div>`;
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


