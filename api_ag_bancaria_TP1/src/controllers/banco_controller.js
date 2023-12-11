const Validator = require('validatorjs'); // importa o pacote de validação
const connection = require('../configs/mysql.config'); // importa a configuração de acesso ao bd

//mostra as informações de uma conta cadastrada específica pelo ID
function show(req, res) {
    console.log(req.params.id_ban) // imprime o parâmetro para observação de erros, req.params."linha da tabela do bd"
    const id_banco = req.params.id_ban; // atribui o id_con do bd à constante
  
    if (id_banco == undefined) {
      return res.json({ erro: 'Erro - ID do banco = undefined - show' });
    }
  
    connection.query('SELECT * FROM banco WHERE id_ban = ?', [id_banco], function (err, resultado) {
  
      if (err) {
        console.error('Erro no MySQL:', err);
        return res.json({ erro: 'Ocorreram erros ao tentar buscar a informação no banco de dados - show' });
      }
  
      if (resultado.length == 0) {
        return res.json({ erro: `O código #${id_banco} não foi encontrado!` });
      }
  
      return res.json(resultado[0]);
  
    });
  }

  //lista todas as contas cadastradas
function list(request, response) {
  
  connection.query('SELECT * FROM banco', function (err, resultado) {
    if (err) {
      return response.json({erro: "Ocorreram erros ao buscar os bancos - list"})}

      const descricao = "Os dados de bancos cadastrados são os seguintes:";
      return response.json({descricao, dados : resultado });
    }
  )}

  //cria uma conta
  function create(request, response) { //O request é um objeto que contém os dados enviados pela solicitação HTTP. O response é um objeto que será usado para enviar a resposta HTTP.
    const { nome_fantasia, razao_social, cnpj, numero } = request.body; // e atribui os valores dos campos do corpo da solicitação HTTP às variáveis
  
    const regras = {       //regras de validacao
      nome_fantasia: 'required|string',
      razao_social: 'required|string',
      cnpj: 'required|size:18',
      numero: 'required|size:3',      
    };
  
    const validacao = new Validator(request.body, regras); // utiliza o pacote de validação
  
    if (validacao.fails()) {
      const erros = validacao.errors;
      return response.json({ erros: erros });
    } // verifica se validação deu certo
  
    connection.query(
      'INSERT INTO banco (nome_fantasia, razao_social, cnpj, numero) VALUES (?, ?, ?, ?)',
      [nome_fantasia, razao_social, cnpj, numero],
      function (err, resultado) {
        if (err) {
          return response.json({ erro: "Ocorreram erros ao salvar a informação - create" });
        }
  
        if (resultado.affectedRows == 0) {
          return response.json({ erro: "Ocorreram erros ao salvar a informação - create" });
        }
  
        return response.json({
          nome_fantasia, 
          razao_social, 
          cnpj, 
          numero,
          id_ban: resultado.insertId,// retorna o id, ele é autoincrementado pelo bd
        });
      }
    );
  }


  function update(request, response) {
    console.log(request.params.id_ban);
    const id_banco = request.params.id_ban;
  
    const { nome_fantasia, razao_social, cnpj, numero } = request.body;
  
    // Validação dos campos usando Validator.js
    
    const regras = {       //regras de validacao
      nome_fantasia: 'required|string',
      razao_social: 'required|string',
      cnpj: 'required|size:18',
      numero: 'required|size:3',      
    };

    const validacaoUpdate = new Validator (request.body, regras); // let validation = new Validator(data, rules [, customErrorMessages]);
  
    if (validacaoUpdate.fails()) {
      const erros = validacaoUpdate.errors;
      return response.json({ erros: erros });
    } // verifica se validação deu errado, em caso positivo imprime uma mensagem
  
    connection.query(
      'UPDATE banco SET nome_fantasia = ?, razao_social = ?, cnpj = ?, numero = ? WHERE id_ban = ?',
      [nome_fantasia, razao_social, cnpj, numero, id_banco], // no update é necessário colocar a referência ao id_ban
      function (err, resultado) {
        if (err) {
          console.error('Erro no MySQL ao atualizar o banco:', err);
          return response.json({ erro: "Ocorreram erros ao atualizar o banco" });
        }
  
        if (resultado.affectedRows === 0) {
          return response.json({ erro: `Banco #${id_banco} não foi encontrada - update` });
        }
  
        return response.json({
          nome_fantasia, 
          razao_social, 
          cnpj, 
          numero,
          id_ban: id_banco,
        });
      }
    );
  }

  function destroy(request, response) {
    const id_banco = request.params.id_ban;
  
    // Excluir depósitos associados à conta
    connection.query('DELETE FROM banco WHERE id_ban = ?', [id_banco], function (errors, results) {
      if (errors) {
        console.error('Erro no MySQL ao excluir bancos:', errors);
        return response.json({ erro: "Ocorreram erros ao excluir bancos" });
      }
      if (results.affectedRows === 0) {
        return response.json({ erro: `Banco #${id_banco} não foi encontrada - delete` });
      }

      return response.json({ mensagem: `Banco #${id_banco}, nome_fantasia razao_social,cnpj, numero,
      id_banco excluído com sucesso` });
    });
      
  }
  //teste

//configuração de rotas serão adicionadas abaixo desse comentário



module.exports = {show, list, create, update, destroy}

