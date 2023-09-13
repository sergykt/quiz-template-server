const express = require('express');
const { questionController } = require('../controllers/controllers');

const router = express.Router();

router.get('/', questionController.getAll);
router.post('/', questionController.create);
router.put('/:id', questionController.update);
router.delete('/:id', questionController.delete);
router.get('/quiz', questionController.getQuiz);

module.exports = router;
