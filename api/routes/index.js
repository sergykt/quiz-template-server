const questionRouter = require('./questionRouter');
const categoryRouter = require('./categoryRouter');
const { isInputNotEmpty, getCurrentTime } = require('../utilz/index');
const { tables } = require('../database');

const { questionsTable, categoriesTable } = tables;

const apiPath = '/api';

const routes = {
  data: () => [apiPath, 'data'].join('/'),
  questions: () => [apiPath, 'questions'].join('/'),
  categories: () => [apiPath, 'categories'].join('/'),
};

const addRoutes = async (app, db) => {
  app.get(routes.data(), async (req, res) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const categories = await db.any(`SELECT * FROM ${categoriesTable} ORDER BY id ASC`);
      const questions = await db.any(`SELECT * FROM ${questionsTable} ORDER BY id ASC`);
      const data = { categories, questions };
      console.log(`[${getCurrentTime()}] Запрос данных успешно обработан.`);
      res.json(data);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить данные: ${err}.`);
      res.status(500).end();
    }
  });

  app.use(routes.questions(), questionRouter(db));
  app.use(routes.categories(), categoryRouter(db));

  return app;
};

module.exports = addRoutes;
