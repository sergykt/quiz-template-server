const express = require('express');
const { questionController } = require('../controllers/controllers');
const { questionMiddleware } = require('../middlewares/middlewares');

const router = express.Router();

router.get('/', questionController.getAll);
router.get('/quiz', questionController.getQuiz);
router.post('/', questionMiddleware.validateCreate, questionController.create);
router.put('/:id', questionMiddleware.validateUpdate, questionController.update);
router.delete('/:id', questionMiddleware.validateDelete, questionController.delete);

module.exports = router;
