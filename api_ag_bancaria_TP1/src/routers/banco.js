const express = require ('express');
const bancoController = require('../controllers/banco_controller');

const router = express.Router();

// configuração de rotas

router.get('/banco/:id_ban', bancoController.show);
router.get('/banco', bancoController.list);
router.post('/banco', bancoController.create);
router.put('/banco/:id_ban', bancoController.update);
router.delete('/banco/:id_ban', bancoController.destroy);


module.exports = router;


