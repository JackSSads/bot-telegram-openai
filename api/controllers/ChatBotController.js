// Importando as classes Configuration e OpenAIApi do pacote openai
const { Configuration, OpenAIApi } = require('openai');

// Importando o pacote dotenv para carregar as variáveis de ambiente
require('dotenv').config();

// Exportando a classe ChatController
module.exports = class ChatController {

    // Método estático que recebe uma requisição e uma resposta
    static question(req, res) {

        // Criando uma nova instância da classe Configuration com a apiKey do OpenAI carregada da variável de ambiente
        const config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Criando uma nova instância da classe OpenAIApi com a instância de Configuration criada anteriormente
        const openia = new OpenAIApi(config);

        // Função assíncrona que recebe um prompt e faz uma chamada ao método createCompletion do pacote OpenAI, retornando uma resposta em JSON
        const runPrompt = async (data) => {
            const prompt = data;

            // Chamada ao método createCompletion do pacote OpenAI, passando o modelo, o prompt, o número máximo de tokens e a temperatura como parâmetros
            const response = await openia.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 2048,
                temperature: 1
            });

            // Criando um objeto com a resposta retornada pelo OpenAI
            const dataRes = {
                data: response.data.choices[0].text,
            };

            // Retornando a resposta em JSON com o código de status 200
            return res.status(200).json({
                dataRes,
            });
        };

        // Obtendo a pergunta do parâmetro passado na URL da requisição
        const question = req.params.question;

        // Chamando a função assíncrona runPrompt passando a pergunta obtida anteriormente
        runPrompt(question);
    };
};