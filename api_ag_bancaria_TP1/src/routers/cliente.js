const express = require('express'); // importa módulo express
const clienteController = require ('../controllers/cliente_controller'); //importa controllers

const router = express.Router();

//definir endpoinst e métodos de solicitações
router.get('/cliente/:id_cli', clienteController.show);

