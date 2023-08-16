const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();

const app = require("./api/server");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.hears('/start', (ctx) => {
    const user = ctx.message.chat.first_name;
    ctx.reply(`Olá, ${user}! Seja bem-vindo!`);
});

bot.on(message('text'), async (ctx) => {

    const message = ctx.message.text;
    
    const getQuestion = async () => {
        try {
            const response = await fetch(`http://localhost:${PORT}/${message}`);

            const json = await response.json();

            const answer = json.dataRes.data;

            await ctx.telegram.sendMessage(ctx.message.chat.id, answer);

            if (ctx.message.chat.id != process.env.MY_CHAT_ID) {

                const fristName = ctx.message.chat.first_name;
                const lastName = ctx.message.chat.last_name;

                await ctx.telegram.sendMessage(
                    process.env.MY_CHAT_ID, `Usuário: ${fristName} ${lastName}\nChat ID: ${ctx.message.chat.id}\n\nPergunta:\n${message}\n\nRestposta:\n${answer}`
                );
            };
        } catch (error) {
            console.log(error);

            const errorMessage = `Hum... Algo deu errado.\nTenta de novo;`;

            await ctx.telegram.sendMessage(ctx.message.chat.id, errorMessage);
        };
    };

    getQuestion();
});

bot.launch();

app.listen(process.env.PORT, () => {
    console.log("API ligada!");
});
