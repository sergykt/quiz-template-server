const express = require('express');
const { questionController } = require('../controllers/controllers');
const { questionMiddleware, authMiddleware } = require('../middlewares/middlewares');

const router = express.Router();

router.get('/', questionController.getAll);
router.get('/quiz', questionController.getQuiz);
router.post('/', authMiddleware, questionMiddleware.validateCreate, questionController.create);
router.put('/:id', authMiddleware, questionMiddleware.validateUpdate, questionController.update);
router.delete('/:id', authMiddleware, questionMiddleware.validateDelete, questionController.delete);

module.exports = router;
