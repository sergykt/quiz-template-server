const express = require('express');
const { categoryController } = require('../controllers/controllers');
const { categoryMiddleware, authMiddleware, adminMiddleware } = require('../middlewares/middlewares');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, categoryController.getAll);
router.post('/', authMiddleware, adminMiddleware, categoryMiddleware.validateCreate, categoryController.create);
router.put('/:id', authMiddleware, adminMiddleware, categoryMiddleware.validateUpdate, categoryController.update);
router.delete('/:id', authMiddleware, adminMiddleware, categoryMiddleware.validateDelete, categoryController.delete);

module.exports = router;
