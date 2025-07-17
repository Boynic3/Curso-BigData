//Lógica do Menu Mobile
const btnMobile = document.getElementById('btn-mobile');    //Botão do menu mobile
const menuItens = document.getElementById('menu-mobile-itens');     //Seleciona o menu mobile
btnMobile.addEventListener('click', () => {                 //Adciona um evento de cliqque ao botão do menu mobile
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
    gemini: "COLOCAR CHAVE TODA VEZ", //Chave da API do Gemini
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

async function obterRespostaDoGemini() {//Função para obter a resposta do Gemini
    const apiKey = CHAVES_API.gemini; //Obtém a chave da API do Gemini
    if(!apiKey){//Se a chave da API não estiver configurada
        return "A chave da API do Gemini não foi configurada.";//Retorna uma mensagem de erro informando que a chave não foi configurada
    } //Fim da verificação da chave da API

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; //Define a URL da API do Gemini com a chave da API
    
    const payload = { //O payload agora contém o histórico da conversa
        contents: historicoChat,  //Inclui o histórico de mensagens para contexto
        systemInstruction:{ //Instrução do sistema para o modelo
            parts:[{ // Parte da instrução do sistema
                text: "Você é o Scambot, o assistente oficial e super prestativo do Scambo, que guia cada usuário de forma intuitiva, proativa, amigável e acessível para encontrar, publicar e finalizar trocas de itens usados com facilidade e segurança, antecipando suas necessidades e resolvendo dúvidas rapidamente. Responda à seguinte pergunta de forma concisa e útil." // Texto da instrução do sistema
            }]//Fim da parte da instrução do sistema
        }//Fim da instrução do sistema

    };   //Fim do payload

    const response = await fetch(apiUrl, {  //Faz uma requisição para a API do Gemini
        method: 'POST', //Define o método como POST
        headers: {'Content-type': 'application/json'},   //Define o cabeçalho Content-Type como JSON
        body: JSON.stringify(payload)   //Converte o payload para JSON
    }); //Fim da requisição fetch

    if(!response.ok){ //Se a resposta da API não for OK
        throw new Error(`Erro na API do Gemini: ${response.statusText}`);   //Lança um erro com o status da resposta
    } //Fim da verificação da resposta
    
    const result = await response.json(); //Converte a resposta da API para JSON

    if(result.candidates && result.candidates.length > 0) { //Se houver candidatos na resposta
        return result.candidates[0].content.parts[0].text; //Retorna o texto da primeira parte do primeiro candidato
    } else{ //Se não houver candidatos na resposta
        return "Não consegui gerar uma resposta no momento."; //Retorna uma mensagem de erro informando que não foi possível gerar uma resposta
    } //Fim da verificação dos candidatos
} //Fim da função obterRespostaDoGemini

btnEnviarChat.addEventListener('click', enviarMensagem); // Adciona um evento de clique ao botão de enviar chat para chamar a função enviarMensagem
inputChat.addEventListener('keypress',(e) => { //Adciona um evento de tecla pressionada ao input de chat
    if(e.key==='Enter') enviarMensagem(); //Se a tecla pressionada for Enter, chama a função enviarMensagem
}); //Fim do evento de tecla pressionada

//Fim do script do Chatbot