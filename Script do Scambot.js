//Lógica do Menu Mobile
const btnMobile = document.getElementById('btn-mobile');    //Botão do menu mobile
const menuItens = document.getElementById('menu-mobile-itens');     //Seleciona o menu mobile
btnMobile.addEventListener('click', () => {                 //Adciona um evento de clique ao botão do menu mobile
    menuItens.classList.toggle('hidden');
});       //Fim da lógica do menu mobile

//Lógica do Chatbot
const btnAbrirChat = document.getElementById('btn-abrir-chat'); //Botão para abrir o chat
const btnFecharChat = document.getElementById('btn-fechar-chat');   //Botão para fechar o chat
const janelaChat = document.getElementById('janela-chat');        //A janela do chat que será exibida
const corpoChat = document.getElementById('corpo-chat');         //A área onde as mensagens serão exibidas
const inputChat = document.getElementById('input-chat');        //O input de texto para enviar mensagens
const btnEnviarChat = document.getElementById('btn-enviar-chat');    //Botão para enviar mensagens
const seletorIA = document.getElementById('seletor-ia');      //Seletor para escolher o provedor de IA

//Array para guardar o histórico da conversa
let historicoChat = [];

const CHAVES_API = {
    gemini: "AIzaSyDYzEJROEInI12DL8Jr62qt5dYiRWIw9xQ", //Chave da API do Gemini
    claude: "SUA_CHAVE_CLAUDE_AQUI", //Chave da API do Claude (ainda não configurada)

};                           //Fim das chaves de API

btnAbrirChat.addEventListener('click', () => {     //Evento para abrir a janela do chat
    janelaChat.classList.remove('hidden'); //Remove a classe 'hidden' para exibir o chat
    btnAbrirChat.classList.add('hidden');
    corpoChat.scrollTop = corpoChat.scrollHeight; //Rola para o final do chat
});                  //Fim do evento de abrir o chat

btnFecharChat.addEventListener('click', () => {    //Evento para fechar a janela do chat
    janelaChat.classList.add('hidden');            //Adiciona a classe 'hidden' para ocultar o chat
    btnAbrirChat.classList.remove('hidden');           //Remove a classe 'hidden' do botão de abrir chat para exibí-lo novamente
});                     //Fim do evento de fechar o chat

const enviarMensagem = async () => { //Função para enviar a mensagem do usuário

    const mensagemUsuario = inputChat.value.trim(); //Pega o valor do input e remove espaços em branco no início e no final
    if(mensagemUsuario === "") return; //Se a mensagem estiver vazia, não faz nada

    adcionarMensagemNaTela(mensagemUsuario, 'mensagem-usuario'); //Adiciona a mensagem do usuário na tela
    inputChat.value = ""; //Limpa o input de texto após enviar a mensagem

    historicoChat.push({ role: 'user', parts:[{ text: mensagemUsuario }]  }); //Adiciona a mensagem do usuário no histórico

    const divDigitando = adcionarMensagemNaTela('Digitando...', 'mensagem-bot-digitando'); //Adiciona a mensagem de "Digitando..." na tela
    
    const iaSelecionada = seletorIA.value; //Pega o valor do seletor de IA para saber qual provedor usar

    try{ //Tenta obter a resposta da IA com base na mensagem do usuário
        const respostaIA = await obterRespostaDaIA(iaSelecionada); //Chama a função para obter a resposta da IA
        divDigitando.remove(); //Remove a mensagem de "Digitando..." da tela após receber a resposta
        adcionarMensagemNaTela(respostaIA, 'mensagem-bot'); //Adiciona a resposta da IA na tela
        historicoChat.push({ role: "model", parts:[{text:respostaIA}] }); //Adiciona a resposta da IA no histórico
    } catch (error) { //Se ocorrer um erro ao obter a resposta da IA
        console.error("Erro ao obter resposta da IA:", error); //Exibe o erro no console
        divDigitando.remove(); //Remove a mensagem de "Digitando..." da tela
        adcionarMensagemNaTela("Desculpe, ocorreu um erro ao processar sua solicitação.", 'mensagem-bot'); //Adiciona uma mensagem de erro na tela
    
        historicoChat.pop(); //Remove a última mensagem do histórico (a do usuário) já que não foi possível obter uma resposta da IA

    } //Fim do tratamento de erro
}; //Fim da função enviarMensagem

function adcionarMensagemNaTela(texto, classe) { //Função para adicionar uma mensagem na tela do chat
    const divMensagem = document.createElement('div'); //Cria um novo elemento div para a mensagem
    divMensagem.className = classe;  //Define a classe da div com base no tipo de mensagem (usuário ou bot)
    divMensagem.innerHTML = `<span>${texto}</span>`; //Define o conteúdo da div com o texto da mensagem
    corpoChat.appendChild(divMensagem);   //Adciona a div de mensagem ao corpo do chat
    corpoChat.scrollTop = corpoChat.scrollHeight; //Rola o chat para baixo para mostrar a nova mensagem
    return divMensagem; //Retorna a div da mensagem para que possa ser manipulada posteriormente(como remover a mensagem de "Digitando...")
}//Fim da função adcionarMensagemNaTela

async function obterRespostaDaIA(provedor) {//Função para obter a resposta da IA com base no provedor selecionado
    switch(provedor){   //Verifica qual provedor de IA foi selecionado
        case 'gemini':  //Se o provedor for Gemini
            return await obterRespostaDoGemini();  //Chama a função para obter a resposta do Gemini
        case 'claude':   //Se o provedor for Claude (ainda não implementado)
            return "Resposta simulada do Claude: Olá! Como posso te ajudar hoje?";//Retorna uma resposta simulada para o Claude
        default: //Se o provedor não for reconhecido
            return "Provedor de IA não reconhecido.";//Retorna uma mensagem de erro indicando que o provedor não é reconhecido
    }//Fim da função obterRespostaDaIa
}//Fim da função obterRespostaDaIa

// Integração com backend Gemini
async function obterRespostaDoGemini() {
    const apiUrl = `http://localhost:3000/api/chat`; //Endpoint local

    //Configura requisição
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify({ historicoChat }) //Envia o histórico
    });

    // Trata erros de rede/HTTP
    if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.statusText}`);
    }
    
    // Processa resposta JSON
    const result = await response.json();
    return result.resposta || "Sem resposta disponível";
}

// Eventos de envio (clique no botão e tecla Enter)
btnEnviarChat.addEventListener('click', enviarMensagem);
inputChat.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensagem();
});


//Fim do script do Chatbot