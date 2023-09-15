const express = require('express');
const { categoryController } = require('../controllers/controllers');
const { categoryMiddleware } = require('../middlewares/middlewares');

const router = express.Router();

router.get('/', categoryController.getAll);
router.post('/', categoryMiddleware.validateCreate, categoryController.create);
router.put('/:id', categoryMiddleware.validateUpdate, categoryController.update);
router.delete('/:id',  categoryMiddleware.validateDelete, categoryController.delete);

module.exports = router;
