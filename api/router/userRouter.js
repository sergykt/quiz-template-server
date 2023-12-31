const express = require('express');
const { authMiddleware, adminMiddleware, userMiddleware } = require('../middlewares/middlewares');
const { userController } = require('../controllers/controllers');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, userController.getAll);
router.get('/refresh', userController.refresh);
router.get('/results', authMiddleware, userController.getResults);
router.post('/', userMiddleware.validateCreate, userController.create);
router.post('/login', userMiddleware.validateLogin, userController.login);
router.post('/logout', userController.logout);
router.post('/verify', userController.verify);
router.post('/sendlink', userController.sendLink);
router.post('/results', authMiddleware, userMiddleware.validateResults, userController.addResults);
router.post('/sendresults', authMiddleware, userController.sendResults);
router.delete('/:id', authMiddleware, adminMiddleware, userMiddleware.validateDelete, userController.delete);

module.exports = router;
