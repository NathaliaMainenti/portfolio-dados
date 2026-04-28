// 1. Função para trocar de abas (SPA - Single Page Application)
function showTab(tabId) {
    // Esconde todas as abas removendo a classe 'active'
    document.querySelectorAll('.container').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostra a aba clicada adicionando a classe 'active'
    document.getElementById(tabId).classList.add('active');

    // Opcional: faz a página subir ao topo na troca de aba
    window.scrollTo(0, 0);
}

// 2. Função para o Chatbot se comunicar com o Python no Render
async function enviarMensagem() {
    const input = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const pergunta = input.value.trim();

    // Se o campo estiver vazio, não faz nada
    if (!pergunta) return;

    // Adiciona a mensagem do usuário na tela imediatamente
    chatWindow.innerHTML += `<div class="msg user">${pergunta}</div>`;
    
    // Limpa o campo de entrada e foca nele novamente
    input.value = "";
    input.focus();

    // Rola o chat para baixo
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // --- CONEXÃO COM O BACKEND ---
    // Substitua o link abaixo pela URL que o Render te fornecer
    const URL_DO_RENDER = "https://onrender.com";

    try {
        // Mostra uma mensagem de "digitando..."
        const loadingMsg = document.createElement("div");
        loadingMsg.className = "msg bot";
        loadingMsg.innerText = "Consultando arquivos Disney...";
        loadingMsg.id = "loading";
        chatWindow.appendChild(loadingMsg);

        // Faz a requisição para a sua API Python
        const response = await fetch(`${URL_DO_RENDER}?texto=${encodeURIComponent(pergunta)}`);
        
        if (!response.ok) throw new Error("Erro na resposta do servidor");

        const data = await response.json();

        // Remove o "digitando..." e coloca a resposta real
        document.getElementById("loading").remove();
        chatWindow.innerHTML += `<div class="msg bot">${data.resposta}</div>`;

    } catch (error) {
        // Trata erros (servidor offline ou erro de rede)
        if (document.getElementById("loading")) document.getElementById("loading").remove();
        chatWindow.innerHTML += `<div class="msg bot">⚠️ Erro: O servidor Python está carregando ou offline. Tente novamente em alguns segundos.</div>`;
    }

    // Rola o chat para o final de novo após a resposta
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 3. Atalho: Enviar mensagem ao apertar a tecla "Enter"
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        enviarMensagem();
    }
});

function openDisneyBot() {
    // Esconde a grade de projetos e mostra o bot
    document.querySelector('.project-grid').style.display = 'none';
    document.getElementById('disney-bot-area').style.display = 'block';
}

function closeDisneyBot() {
    // Esconde o bot e volta para a grade de projetos
    document.querySelector('.project-grid').style.display = 'grid';
    document.getElementById('disney-bot-area').style.display = 'none';
}
