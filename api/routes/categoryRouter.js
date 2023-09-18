const express = require('express');
const { categoryController } = require('../controllers/controllers');
const { categoryMiddleware, authMiddleware } = require('../middlewares/middlewares');

const router = express.Router();

router.get('/', categoryController.getAll);
router.post('/', authMiddleware, categoryMiddleware.validateCreate, categoryController.create);
router.put('/:id', authMiddleware, categoryMiddleware.validateUpdate, categoryController.update);
router.delete('/:id', authMiddleware, categoryMiddleware.validateDelete, categoryController.delete);

module.exports = router;
