// Importando a classe Telegraf do módulo 'telegraf'
const { Telegraf } = require('telegraf');

// Importando o filtro 'message' do módulo 'telegraf/filters'
const { message } = require ('telegraf/filters');

// Carregando variáveis de ambiente definidas no arquivo '.env'
require('dotenv').config();

// Importando a instância do servidor Express do arquivo 'server.js'
const app = require("./api/server");

// Definindo a porta do servidor a partir da variável de ambiente ou a porta 3000
const PORT = process.env.PORT || 3000

// Criando uma nova instância do Telegraf, passando o token do bot como parâmetro
const bot = new Telegraf(process.env.BOT_TOKEN);

// Definindo a ação a ser executada quando o usuário enviar a mensagem "/start"
bot.hears('/start', (ctx) => {

    // Armazenando o nome do usuário
    const user = ctx.message.chat.first_name;

    ctx.reply(`Olá, ${user}! Seja bem-vindo!`);
});

// Definindo a ação a ser executada quando o usuário enviar uma mensagem de texto
bot.on(message('text'), async (ctx) => {

    // Armazenando a mensagem enviada pelo usuário em uma variável
    const message = ctx.message.text;

    // Definindo uma função assíncrona que fará uma requisição HTTP para o servidor Express
    const getQuestion = async () => {
        try {
            // Fazendo uma requisição HTTP para a rota correspondente à mensagem enviada pelo usuário
            const response = await fetch(`http://localhost:${PORT}/${message}`)

            // Parseando a resposta como um objeto JSON
            const json = await response.json();

            // Armazenando a resposta do servidor em uma variável
            const answer = json.dataRes.data;

            // Enviando a resposta do servidor como uma mensagem para o usuário
            await ctx.telegram.sendMessage(ctx.message.chat.id, answer);

            // Redirecionando todas as buscas para o meu Chat contendo nome do usuário, pergunta e resposta obtida
            if (ctx.message.chat.id != process.env.MY_CHAT_ID){
                await ctx.telegram.sendMessage(process.env.MY_CHAT_ID, `Usuário: ${ctx.message.chat.first_name}\nChat ID${ctx.message.chat.id}\nMensagem:${answer}`);
            };
        } catch (error) {
            // Caso ocorra algum erro na requisição, envia uma mensagem de erro para o usuário
            console.log(error);

            const errorMessage = "Hum... Algo deu errado.\nTenta de novo ;)"

            await ctx.telegram.sendMessage(ctx.message.chat.id, errorMessage);
        };
    };

    // Chamando a função assíncrona que fará a requisição HTTP
    getQuestion();
});

// Iniciando o bot
bot.launch();

// Iniciando o servidor Express
app.listen(process.env.PORT || 3000, () => {
    console.log("API ligada!")
});
