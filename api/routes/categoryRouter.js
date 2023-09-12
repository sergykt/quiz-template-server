const express = require('express');
const { isInputNotEmpty, getCurrentTime } = require('../utilz/index');
const { tables: { categoriesTableTable } } = require('../database');

const categoryRouter = (db) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { body } = req;
    const {
      name,
    } = body;
  
    if (isInputNotEmpty(name)) {
      try {
        const result = await db.one(`INSERT INTO ${categoriesTable} (name) VALUES ($1) RETURNING id`, name);
        console.log(`[${getCurrentTime()}] Вставлен новый ряд категории с ID: ${result.id}.`);
        res.status(201).end();
      } catch (err) {
        if (err.code === '23505') {
          console.error(`[${getCurrentTime()}] Такая категория уже существует.`);
          res.status(400).json({ error: 'This Category Already Exists' });
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

  return router;
};

module.exports = categoryRouter;
