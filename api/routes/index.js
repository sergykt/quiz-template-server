const questionRouter = require('./questionRouter');
const categoryRouter = require('./categoryRouter');
const userRouter = require('./userRouter');
const { trimFields } = require('../middlewares/middlewares');
const { getCurrentTime } = require('../services/services');

const apiPath = '/api';

const routes = {
  questions: () => [apiPath, 'questions'].join('/'),
  categories: () => [apiPath, 'categories'].join('/'),
  users: () => [apiPath, 'users'].join('/'),
  userRoles: () => [apiPath, 'user_roles'].join('/'),
};

const addRoutes = (app) => {
  app.use(trimFields);
  app.use(routes.questions(), questionRouter);
  app.use(routes.categories(), categoryRouter);
  app.use(routes.users(), userRouter);
  app.use((req, res) => {
    console.error(`[${getCurrentTime()}] Неправильная конечная точка`);
    res.status(404).json('Not Found');
  });
};

module.exports = addRoutes;
