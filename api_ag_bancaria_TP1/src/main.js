const express = require('express');
const app = express();

//função que tem acesso aos objetos de solicitação ('req', 'res')
app.use(express.json());

// importação de configuração de rotas
const contaRouter = require('./routers/agencia_banc');
const bancoRouter = require('./routers/banco')

//configuração de uso das rotas
app.use(contaRouter);
app.use(bancoRouter);

app.get('/', function (request, response) {
    return response.send('API Funcionando...');
  });


app.listen(3000, function (){
    console.log('API iniciada na porta: 3000');
});