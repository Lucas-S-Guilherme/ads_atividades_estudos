const express = require ('express');
const contaController = require('../controllers/agencia_banc.controller');

const router = express.Router();

// configuração de rotas

router.get('/conta/:id_con', contaController.show);
router.get('/conta', contaController.list);
router.post('/conta', contaController.create);
router.put('/conta/:id_con', contaController.update);
router.delete('/conta/:id_con', contaController.destroy);


module.exports = router;


