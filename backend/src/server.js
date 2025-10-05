const express = require('express');
const cors = require('cors');

require('./database');

const routes = require('./routes/routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

const PORT = 3001;

app.listen(PORT, () => {
    // Isso vai exibir uma mensagem no SEU terminal para você saber que tudo deu certo.
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});