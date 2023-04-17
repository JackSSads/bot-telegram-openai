const express = require('express');
const chatroutes = require("./routes/ChatBotRoutes");

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.use("/", chatroutes);

module.exports = app;