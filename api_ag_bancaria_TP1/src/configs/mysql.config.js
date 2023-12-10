// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Note490!@',
  database: 'agencia_bancaria_db', 
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados de contatos:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados de contatos');
});




module.exports = connection;