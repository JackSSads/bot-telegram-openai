const express = require("express");
const router = express.Router();

const ChatBotController = require("../controllers/ChatBotController");

// Rota GET para o endpoint /:question, em que question é o 
//parâmetro que representa a pergunta feita pelo usuário.
router.get('/:question', ChatBotController.question);

module.exports = router;