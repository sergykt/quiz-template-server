const express = require('express');
const { userController } = require('../controllers/controllers');

const router = express.Router();

//router.get('/', userController.getAll);
router.post('/', userController.create);
router.post('/login', userController.login);
//router.put('/:id', userController.update);
//router.delete('/:id', userController.delete);

module.exports = router;
