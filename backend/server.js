// 1. Importar as bibliotecas necessárias
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 2. Configurar o servidor Express
const app = express();
app.use(cors());
app.use(express.json());

//Pega a  cahve da API do arquivo .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 3. Criar o endpoint /api/Chat
app.post('/api/Chat', async (req, res) => {
    try {
        const { historicoChat } = req.body; //Pega o histórico do chat enviado pelo cliente

        if (!historicoChat) {
            return res.status(400).json({ error: 'Histórico de chat é obrigatório.' }); //Retorna um erro se o histórico não for fornecido
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`; //Define a URL da API do Gemini com a chave da API

        const payload = { //O payload agora contém o histórico da conversa
        contents: historicoChat,  //Inclui o histórico de mensagens para contexto
        systemInstruction:{ //Instrução do sistema para o modelo
            parts:[{ // Parte da instrução do sistema
                text: "Você é o Scambot, o assistente oficial e super prestativo do Scambo, que guia cada usuário de forma intuitiva, proativa, amigável e acessível para encontrar, publicar e finalizar trocas de itens usados com facilidade e segurança, antecipando suas necessidades e resolvendo dúvidas rapidamente. Responda à seguinte pergunta de forma concisa e útil." // Texto da instrução do sistema
            }]//Fim da parte da instrução do sistema
        }//Fim da instrução do sistema

    };   //Fim do payload

        const geminiResponse = await fetch(apiUrl, {  //Faz uma requisição para a API do Gemini
            method: 'POST', //Define o método como POST
            headers: {'Content-type': 'application/json'},   //Define o cabeçalho Content-Type como JSON
            body: JSON.stringify(payload)   //Converte o payload para JSON
        }); //Fim da requisição fetch

        if (!geminiResponse.ok) { //Se der erro na API do Google, vamos ver o que ela respondeu
            const errorText = await geminiResponse.text(); //Pega o texto de erro da resposta
            console.error("Erro na API do Gemini:", errorBody); //Exibe o erro no console;
            throw new Error(`Erro na API externa: ${geminiResponse.statusText}`); //Lança um erro com o status da resposta e o texto de erro
        } //Fim da verificação da resposta

        const result = await geminiResponse.json(); //Converte a resposta da API para JSON

        //Verificação de segurança para garantir que a resposta existe
        if (result.candidates && result.candidateslength > 0 && result.candidates[0].content.parts.length > 0) {
            const respostaIA = result.candidates[0].content.parts[0].text; //Pega o texto da resposta da IA
            return res.json({ resposta: respostaIA }); //Retorna a resposta da IA para o cliente no front-end
        } else {
            //Caso a API retorne uma resposta vazia ou bloqueada
            console.error("Resposta inválida ou bloqueada da API:", result); //Exibe o erro no console
            res.json({ resposta: "Não consegui gerar uma resposta no momento. Pode ter ocorrido um bloqueio de segurança." }); //Retorna uma mensagem de erro informando que não foi possível gerar uma resposta
        }

    } catch (error) {
        console.error("Erro no backend:", error);
        res.status(500).json({error: 'Ocorreu um erro interno no servidor.'});
    }
});

// 4. Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});