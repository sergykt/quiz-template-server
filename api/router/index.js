const questionRouter = require('./questionRouter');
const categoryRouter = require('./categoryRouter');
const userRouter = require('./userRouter');
const { trimFields } = require('../middlewares/middlewares');
const { getCurrentTime } = require('../services/services');
const routes = require('./routes');

const addRoutes = (app) => {
  app.use(trimFields);
  app.use(routes.questions(), questionRouter);
  app.use(routes.categories(), categoryRouter);
  app.use(routes.users(), userRouter);
  app.use((req, res) => {
    console.error(`[${getCurrentTime()}] Неправильный маршрут`);
    res.status(404).json('Not Found');
  });
};

module.exports = addRoutes;
