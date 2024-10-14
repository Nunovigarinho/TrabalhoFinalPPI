import express from 'express';
import autenticar from './segurança/autenticar.js';
import { verificarAutenticacao, sair } from './segurança/autenticar.js';
import session from 'express-session';

const host = '0.0.0.0'; 
const porta = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'segredo', //chave para criptografia
    resave: true,
    saveUninitialized: true,
    cookie: {  
        maxAge: 1000 * 60 * 30
    }
}));

app.use(express.static('./publico'));


app.get('/login',(requisicao, resposta) => {
    resposta.redirect('/login.html');
});

app.get('/logout', sair);

app.post('/login', autenticar);

app.use(verificarAutenticacao, express.static('./privado'));

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});