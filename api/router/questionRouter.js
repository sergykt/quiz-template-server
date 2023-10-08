const express = require('express');
const { questionController } = require('../controllers/controllers');
const { questionMiddleware, authMiddleware, adminMiddleware } = require('../middlewares/middlewares');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, questionController.getAll);
router.get('/quiz', questionController.getQuiz);
router.post('/', authMiddleware, adminMiddleware, questionMiddleware.validateCreate, questionController.create);
router.put('/:id', authMiddleware, adminMiddleware, questionMiddleware.validateUpdate, questionController.update);
router.delete('/:id', authMiddleware, adminMiddleware, questionMiddleware.validateDelete, questionController.delete);

module.exports = router;
