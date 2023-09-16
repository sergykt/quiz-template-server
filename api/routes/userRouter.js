const express = require('express');
const { authMiddleware, userMiddleware } = require('../middlewares/middlewares');
const { userController } = require('../controllers/controllers');

const router = express.Router();

router.get('/', authMiddleware, userController.getAll);
router.post('/', userMiddleware.validateCreate, userController.create);
router.post('/login', userMiddleware.validateLogin, userController.login);
router.delete('/:id', authMiddleware, userMiddleware.validateDelete, userController.delete);

module.exports = router;
