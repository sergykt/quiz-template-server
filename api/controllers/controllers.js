const { questionModel, categoryModel } = require('../models/models');
const { isInputNotEmpty, getCurrentTime } = require('../utilz/index');
const { db, tables } = require('../database');
const { questionsTable, categoriesTable } = tables;

class QuestionController {
  async getAll(req, res) {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const questions = await questionModel.getAll();
      console.log(`[${getCurrentTime()}] Запрос данных успешно обработан.`);
      res.json(questions);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить вопросы: ${err}.`);
      res.status(500).end();
    }
  }

  async getQuiz(req, res) {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const quiz = await questionModel.getQuiz();
      console.log(`[${getCurrentTime()}] Отправлен квиз на 20 вопросов.`);
      res.json(quiz);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить квиз: ${err}.`);
      res.status(500).end();
    }
  }

  async create(req, res) {
    const { body } = req;
    try {
      const newId = await questionModel.create(body);
      console.log(`[${getCurrentTime()}] Вставлен новый ряд с ID: ${newId}.`);
      res.status(201).end();
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Такой вопрос уже существует.`);
        res.status(400).json({ error: 'This Question Already Exists' });
      } if (err.message === 'Invalid data') {
        console.error(`[${getCurrentTime()}] Невалидные данные: ${err}.`);
        res.status(400).end();
      } else {
        console.error(`[${getCurrentTime()}] Произошла ошибка при вставке данных: ${err}.`);
        res.status(500).end();
      }
    };
  }

  async update(req, res) {
    const id = req.params.id;
    const { body } = req;

    try {
      const rowCount = await questionModel.update(id, body);
      if (rowCount) {
        console.log(`[${getCurrentTime()}] Успешно изменен ряд с ID: ${id}.`);
        res.status(204).end();
      } else {
        res.status(400).json({ error: "This Questions Doesn't Exist" });
      }
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Такой вопрос уже существует.`);
        res.status(400).json({ error: 'This Question Already Exists' });
      } if (err.message === 'Invalid data') {
        console.error(`[${getCurrentTime()}] Невалидные данные: ${err}.`);
        res.status(400).end();
      } else {
        console.error(`[${getCurrentTime()}] Произошла ошибка при вставке данных: ${err}.`);
        res.status(500).end();
      }
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    try {
      const rowCount = await questionModel.delete(id);
      if (rowCount) {
        console.log(`[${getCurrentTime()}] Успешно удален ряд с ID: ${id}.`);
        res.status(204).end();
      } else {
        console.error(`[${getCurrentTime()}] Ошибка: Ни одна запись не была удалена.`);
        res.status(400).json({ error: 'This Question Already Deleted' });
      }
    } catch (err) {
      if (err.message === 'Invalid data') {
        console.error(`[${getCurrentTime()}] Невалидные данные: ${err}.`);
        res.status(400).end();
      } else {
        console.error(`[${getCurrentTime()}] Произошла ошибка при удалении вопроса ${err}.`);
        res.status(500).end();
      }
    }
  }
};

class CategoryController {
  async getAll(req, res) {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const categories = await categoryModel.getAll();
      console.log(`[${getCurrentTime()}] Запрос данных успешно обработан.`);
      res.json(categories);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить категории: ${err}.`);
      res.status(500).end();
    }
  }

  async create(req, res) {
    const { body } = req;
    try {
      const newId = await categoryModel.create(body);
      console.log(`[${getCurrentTime()}] Вставлен новый ряд категории с ID: ${newId}.`);
      res.status(201).end();
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Такая категория уже существует.`);
        res.status(400).json({ error: 'This Category Already Exists' });
      } else if (err.message === 'Invalid data') {
        console.error(`[${getCurrentTime()}] Невалидные данные: ${err}.`);
        res.status(400).end();
      } else {
        console.error(`[${getCurrentTime()}] Произошла ошибка при вставке данных: ${err}.`);
        res.status(500).end();
      }
    };
  }

  async update(req, res) {
    const id = req.params.id;
    const { body } = req;
    const {
      name
    } = body;

    if (isInputNotEmpty(name)) {
      try {
        const result = await questionModel.update(id, body);
        console.log(`[${getCurrentTime()}] Успешно изменен ряд категории с ID: ${id}.`);
        res.status(204).end();
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
  }

  async delete(req, res) {
    const id = req.params.id;
    try {
      const rowCount = await categoryModel.delete(id);
      if (rowCount) {
        console.log(`[${getCurrentTime()}] Успешно удален ряд с ID: ${id}.`);
        res.status(204).end();
      } else {
        console.error(`[${getCurrentTime()}] Ошибка: Ни одна запись не была удалена.`);
        res.status(400).json({ error: 'This Question Already Deleted' });
      }
    } catch (err) {
      if (err.message === 'Invalid data') {
        console.error(`[${getCurrentTime()}] Невалидные данные: ${err}.`);
        res.status(400).end();
      } else {
        console.error(`[${getCurrentTime()}] Произошла ошибка при удалении категории ${err}.`);
        res.status(500).end();
      }
    }
  }
};

module.exports.questionController = new QuestionController();
module.exports.categoryController = new CategoryController();
