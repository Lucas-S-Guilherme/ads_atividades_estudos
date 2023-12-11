const Validator = require('validatorjs'); // importa validador
const connection = require('../configs/mysql.config'); // importa acesso ao bd

//função para consulta específica pelo ID
function show (req, res){
    const id_cliente = req.params.id_cli; // atribuí o parâmetro da solicitação à constante id_cliente

    connection.query('SELECT * FROM cliente WHERE id_cli = ?', [id_cliente], function (error, results){
        if (error){
            console.error('Erro ao consultar(Show):', error);
            return results.json({msgErro: 'Ocorreram erros ao tentar buscar a informação no banco de dados - show'})
        }

        if(results == 0){
            return res.json({ erro: `O código #${id_cliente} não foi encontrado!` });
        }

        return res.json(results[0]); //retorna como resultado da função show, o resultado da função dentro de connection.query(consulta do bd), e só o primeiro dado correspondente [0]
    })
}


module.exports = {show};