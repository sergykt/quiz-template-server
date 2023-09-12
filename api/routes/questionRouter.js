const express = require('express');
const { isInputNotEmpty, getCurrentTime } = require('../utilz/index');
const { tables: { questionsTable } } = require('../database');

const questionRouter = (db) => {
  const router = express.Router();

  router.get('/quiz', async (req, res) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const questions = await db.any(`SELECT * FROM ${questionsTable} ORDER BY RANDOM() LIMIT 20`);
      console.log(`[${getCurrentTime()}] Отправлен квиз на 20 вопросов.`);
      res.json(questions);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить квиз: ${err}.`);
      res.status(500).end();
    }
  });

  router.post('/', async (req, res) => {
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
          `INSERT INTO ${questionsTable} (text, options, answer, recommendation, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
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

  router.put('/:id', async (req, res) => {
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
          `UPDATE ${questionsTable} SET text = $1, options = $2, answer = $3, recommendation = $4, category_id = $5 WHERE id = $6`,
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

  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (id) {
      try {
        const result = await db.result(`DELETE FROM ${questionsTable} WHERE id = $1`, id);
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

  return router;
};

module.exports = questionRouter;
