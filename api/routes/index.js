const questionRouter = require('./questionRouter');
const categoryRouter = require('./categoryRouter');
const { getCurrentTime } = require('../utilz/index');

const apiPath = '/api';

const routes = {
  questions: () => [apiPath, 'questions'].join('/'),
  categories: () => [apiPath, 'categories'].join('/'),
  users: () => [apiPath, 'users'].join('/'),
  userRoles: () => [apiPath, 'userroles'].join('/'),
};

const addRoutes = (app) => {
  app.use(routes.questions(), questionRouter);
  app.use(routes.categories(), categoryRouter);
  app.use((req, res) => {
    console.error(`[${getCurrentTime()}] Неправильная конечная точка`);
    res.status(404).send('Not Found');
  });
};

module.exports = addRoutes;
