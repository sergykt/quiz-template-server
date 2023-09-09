const utilz = require('./utilz');

const { isInputNotEmpty, getCurrentTime } = utilz;

const apiPath = '/api';

const routes = {
  data: () => [apiPath, 'data'].join('/'),
  quiz: () => [apiPath, 'quiz'].join('/'),
  questions: () => [apiPath, 'questions'].join('/'),
  questionsEdit: () => [apiPath, 'questions/:id'].join('/'), 
};

const tables = {
  questions: 'questions',
  categories: 'categories',
};

const addRoutes = (app, db) => {
  app.get(routes.data(), async (req, res) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const categories = await db.any(`SELECT * FROM ${tables.categories} ORDER BY id ASC`);
      const questions = await db.any(`SELECT * FROM ${tables.questions} ORDER BY id ASC`);
      const data = { categories, questions };
      console.log(`[${getCurrentTime()}] Запрос данных успешно обработан.`);
      res.json(data);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить данные: ${err}.`);
      res.status(500).end();
    }
  });
  
  app.get(routes.quiz(), async (req, res) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const questions = await db.any(`SELECT * FROM ${tables.questions} ORDER BY RANDOM() LIMIT 20`);
      console.log(`[${getCurrentTime()}] Отправлен квиз на 20 вопросов.`);
      res.json(questions);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить квиз: ${err}.`);
      res.status(500).end();
    }
  });
  
  app.post(routes.questions(), async (req, res) => {
    const { body } = req;
    const {
      text,
      answer,
      wrongAnswer,
      recommendation,
      category_id,
    } = body;
  
    if (isInputNotEmpty(text, answer, wrongAnswer, recommendation, category_id) && answer !== wrongAnswer) {
      const options = [answer, wrongAnswer];
      options.sort();
      try {
        const result = await db.one(
          `INSERT INTO ${tables.questions} (text, options, answer, recommendation, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [text, options, answer, recommendation, category_id]
        );
        console.log(`[${getCurrentTime()}] Вставлен новый ряд с ID: ${result.id}.`);
        res.status(201).end();
      } catch (err) {
        if (err.code === '23505') {
          console.error(`[${getCurrentTime()}] Такой вопрос уже существует.`);
          res.status(400).json({ error: 'This Question Already Exists' });
        } else {
          console.error(`[${getCurrentTime()}] Произошла ошибка при вставке данных: ${err}.`);
          res.status(500).end();
        }
      };
    } else {
      console.error(`[${getCurrentTime()}] Невалидные данные: ${err}.`);
      res.status(400).end();
    }
  });
  
  app.put(routes.questionsEdit(), async (req, res) => {
    const id = req.params.id;
    const { body } = req;
    const {
      text,
      answer,
      wrongAnswer,
      recommendation,
      category_id,
    } = body;
  
    if (isInputNotEmpty(text, answer, wrongAnswer, recommendation, category_id, id) && answer !== wrongAnswer) {
      const options = [answer, wrongAnswer];
      options.sort();
      try {
        const result = await db.result(
          `UPDATE ${tables.questions} SET text = $1, options = $2, answer = $3, recommendation = $4, category_id = $5 WHERE id = $6`,
          [text, options, answer, recommendation, category_id, id]
        );
        console.log(`[${getCurrentTime()}] Успешно изменен ряд с ID: ${id}.`);
        res.status(204).end();
      } catch (err) {
        if (err.code === '23505') {
          console.error(`[${getCurrentTime()}] Такой вопрос уже существует.`);
          res.status(400).json({ error: 'This Question Already Exists' });
        } else {
          console.error(`[${getCurrentTime()}] Произошла ошибка при вставке данных: ${err}.`);
          res.status(500).end();
        }
      };
    } else {
      console.error(`[${getCurrentTime()}] Невалидные данные: ${err}.`);
      res.status(400).end();
    }
  });
  
  app.delete(routes.questionsEdit(), async (req, res) => {
    const id = req.params.id;
    if (id) {
      try {
        const result = await db.result(`DELETE FROM ${tables.questions} WHERE id = $1`, id);
        if (result.rowCount === 0) {
          console.error(`[${getCurrentTime()}] Ошибка: Ни одна запись не была удалена.`);
          res.status(400).json({ error: 'This Question Already Deleted' });
        } else {
          console.log(`[${getCurrentTime()}] Успешно удален ряд с ID: ${id}.`);
          res.status(204).end();
        }
      } catch (err) {
        res.status(500).end();
      }
    } else {
      console.error(`[${getCurrentTime()}] Невалидные данные: ${err}.`);
      res.status(400).end();
    }
  });
};

module.exports = addRoutes;
