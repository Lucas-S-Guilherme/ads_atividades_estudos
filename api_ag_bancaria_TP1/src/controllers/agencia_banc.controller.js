const Validator = require('validatorjs'); // importa o pacote de validação
const connection = require('../configs/mysql.config'); // importa a configuração de acesso ao bd

//mostra as informações de uma conta cadastrada específica pelo ID
function show(req, res) {
    if (id_conta == undefined) {
      return res.json({ erro: 'Erro - Id da conta = undefined - show' });
    }
  
    connection.query('SELECT * FROM conta JOIN agencia ON conta.agencia_id = agencia.id_age JOIN cliente ON conta.cliente_id = cliente.id_cli WHERE conta.id_con = ?', [id_conta], function (err, resultado) {
  
      if (err) {
        console.error('Erro no MySQL:', err);
        return res.json({ erro: 'Ocorreram erros ao tentar buscar a informação no banco de dados - show' });
      }
  
      if (resultado.length == 0) {
        return res.json({ erro: `O código #${id_conta} não foi encontrado!` });
      }
  
      return res.json(resultado[0]);
  
    });
  }

  //lista todas as contas cadastradas
function list(request, response) {
  
  connection.query('SELECT * FROM conta', function (err, resultado) {
    if (err) {
      return response.json({erro: "Ocorreram erros ao buscar as contas - list"})}

      const descricao = "Os dados de contas cadastrados são os seguintes:";
      return response.json({descricao, dados : resultado });
    }
  )}

  //cria uma conta
  function create(request, response) {
    const { numero, data_abertura, saldo, valor_limite, agencia_id, cliente_id } = request.body;
  
    const regras = {
      numero: 'required|integer',
      data_abertura: 'required|date',
      saldo: 'required|numeric',
      valor_limite: 'required|numeric',
      agencia_id: 'required|integer',
      cliente_id: 'required|integer',
    };
  
    const validacao = new Validator(request.body, regras);
  
    if (validacao.fails()) {
      const erros = validacao.errors;
      return response.json({ erros: erros });
    }
  
    connection.query(
      'INSERT INTO conta (numero, data_abertura, saldo, valor_limite, agencia_id, cliente_id) VALUES (?, ?, ?, ?, ?, ?)',
      [numero, data_abertura, saldo, valor_limite, agencia_id, cliente_id],
      function (err, resultado) {
        if (err) {
          return response.json({ erro: "Ocorreram erros ao salvar a informação - create" });
        }
  
        if (resultado.affectedRows == 0) {
          return response.json({ erro: "Ocorreram erros ao salvar a informação - create" });
        }
  
        return response.json({
          numero,
          data_abertura,
          saldo,
          valor_limite,
          agencia_id,
          cliente_id,
          id_con: resultado.insertId,
        });
      }
    );
  }


  function update(request, response) {
    console.log(request.params.id_con);
    const id_conta = request.params.id_con;
  
    const { numero, data_abertura, saldo, valor_limite, agencia_id, cliente_id } = request.body;
  
    // Validação dos campos usando Validator.js
    
    const validacoes = {
      numero: 'required|integer',
      data_abertura: 'required|date',
      saldo: 'required|numeric',
      valor_limite: 'required|numeric',
      agencia_id: 'required|integer',
      cliente_id: 'required|integer',
    };

    let validation = new Validator (validacoes);
  
    const erros = {};
    Object.keys(validacoes).forEach((campo) => {
      const valorCampo = `${request.body[campo]}`; // Certifica-se de que o valor é uma string
      const funcaoValidacao = Validator[validacoes[campo]];
  
      
    });
  
    if (Object.keys(erros).length > 0) {
      return response.json({ erro: 'Dados inválidos', detalhes: erros });
    }
  
    connection.query(
      'UPDATE conta SET numero = ?, data_abertura = ?, saldo = ?, valor_limite = ?, agencia_id = ?, cliente_id = ? WHERE id_con = ?',
      [numero, data_abertura, saldo, valor_limite, agencia_id, cliente_id, id_conta],
      function (err, resultado) {
        if (err) {
          console.error('Erro no MySQL ao atualizar a conta:', err);
          return response.json({ erro: "Ocorreram erros ao atualizar a conta" });
        }
  
        if (resultado.affectedRows === 0) {
          return response.json({ erro: `Conta #${id_conta} não foi encontrada - update` });
        }
  
        return response.json({
          numero,
          data_abertura,
          saldo,
          valor_limite,
          agencia_id,
          cliente_id,
          id_con: id_conta,
        });
      }
    );
  }

  function destroy(request, response) {
    const id_conta = request.params.id_con;
  
    // Excluir depósitos associados à conta
    connection.query('DELETE FROM deposito WHERE conta_id = ?', [id_conta], function (errDepositos, resultadoDepositos) {
      if (errDepositos) {
        console.error('Erro no MySQL ao excluir depósitos:', errDepositos);
        return response.json({ erro: "Ocorreram erros ao excluir depósitos" });
      }
  
      // Excluir saques associados à conta
      connection.query('DELETE FROM saque WHERE conta_id = ?', [id_conta], function (errSaques, resultadoSaques) {
        if (errSaques) {
          console.error('Erro no MySQL ao excluir saques:', errSaques);
          return response.json({ erro: "Ocorreram erros ao excluir saques" });
        }
  
        // Excluir transferências associadas à conta
        connection.query('DELETE FROM transferencia WHERE conta_origem_id = ? OR conta_destino_id = ?', [id_conta, id_conta], function (errTransferencias, resultadoTransferencias) {
          if (errTransferencias) {
            console.error('Erro no MySQL ao excluir transferências:', errTransferencias);
            return response.json({ erro: "Ocorreram erros ao excluir transferências" });
          }
  
          // Excluir a conta após excluir depósitos, saques e transferências
          connection.query('DELETE FROM conta WHERE id_con = ?', [id_conta], function (errConta, resultadoConta) {
            if (errConta) {
              console.error('Erro no MySQL ao excluir a conta:', errConta);
              return response.json({ erro: "Ocorreram erros ao excluir a conta" });
            }
  
            if (resultadoConta.affectedRows === 0) {
              return response.json({ erro: `Conta #${id_conta} não foi encontrada - delete` });
            }
  
            return response.json({ mensagem: `Conta #${id_conta}, depósitos, saques e transferências associados excluídos com sucesso` });
          });
        });
      });
    });
  }


//configuração de rotas serão adicionadas abaixo desse comentário



module.exports = {show, list, create, update, destroy}

