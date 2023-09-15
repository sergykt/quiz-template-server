const { questionModel, categoryModel, userModel } = require('../models/models');
const { getCurrentTime, generateAccessToken } = require('../utilz/index');

class QuestionController {
  async getAll(req, res) {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const questions = await questionModel.getAll();
      console.log(`[${getCurrentTime()}] Запрос вопросов успешно обработан.`);
      return res.json(questions);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить вопросы: ${err}.`);
      return res.status(500).end();
    }
  }

  async getQuiz(req, res) {
    try {
      const quiz = await questionModel.getQuiz();
      console.log(`[${getCurrentTime()}] Отправлен квиз на 20 вопросов.`);
      return res.json(quiz);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить квиз: ${err}.`);
      return res.status(500).end();
    }
  }

  async create(req, res) {
    const { body } = req;
    try {
      const newId = await questionModel.create(body);
      console.log(`[${getCurrentTime()}] Добавлен новый вопрос с ID: ${newId}.`);
      return res.status(201).end();
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Данный вопрос уже существует.`);
        return res.status(400).json({ errors: 'This Question Already Exists' });
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при добавлении вопроса: ${err}.`);
      return res.status(500).end();
    };
  }

  async update(req, res) {
    const id = req.params.id;
    const { body } = req;

    try {
      const result = await questionModel.update(id, body);
      if (result) {
        console.log(`[${getCurrentTime()}] Изменен вопрос с ID: ${id}.`);
        return res.status(204).end();
      }
      console.error(`[${getCurrentTime()}] Данный вопрос не существует`);
      return res.status(400).json({ errors: "This Questions Doesn't Exist" });
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Данный вопрос уже существует.`);
        return res.status(400).json({ errors: 'This Question Already Exists' });
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при изменении вопроса с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    try {
      const result = await questionModel.delete(id);
      if (result) {
        console.log(`[${getCurrentTime()}] Удален вопрос с ID: ${id}.`);
        return res.status(204).end();
      }
      console.error(`[${getCurrentTime()}] Данный вопрос не существует`);
      return res.status(400).json({ errors: "This Question Doesn't Exist" });
    } catch (err) {
      console.error(`[${getCurrentTime()}] Произошла ошибка при удалении вопроса с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  }
}

class CategoryController {
  async getAll(req, res) {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const categories = await categoryModel.getAll();
      console.log(`[${getCurrentTime()}] Запрос категорий успешно обработан.`);
      return res.json(categories);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить категории: ${err}.`);
      return res.status(500).end();
    }
  }

  async create(req, res) {
    const { body } = req;
    try {
      const newId = await categoryModel.create(body);
      console.log(`[${getCurrentTime()}] Добавлена новая категория с ID: ${newId}.`);
      return res.status(201).end();
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Данная категория уже существует.`);
        return res.status(400).json({ errors: 'This Category Already Exists' });
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при добавлении категории: ${err}.`);
      return res.status(500).end();
    };
  }

  async update(req, res) {
    const id = req.params.id;
    const { body } = req;

    try {
      const result = await categoryModel.update(id, body);
      if (result) {
        console.log(`[${getCurrentTime()}] Изменена категория с ID: ${id}.`);
        return res.status(204).end();
      }
      console.error(`[${getCurrentTime()}] Данная категория не существует`);
      return res.status(400).json({ errors: "This Category Doesn't Exist" });
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Данная категория уже существует.`);
        return res.status(400).json({ errors: 'This Category Already Exists' });
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при изменеии категории с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  };

  async delete(req, res) {
    const id = req.params.id;
    try {
      const result = await categoryModel.delete(id);
      if (result) {
        console.log(`[${getCurrentTime()}] Удалена категория с ID: ${id}.`);
        return res.status(204).end();
      }
      console.error(`[${getCurrentTime()}] Данный вопрос не существует`);
      return res.status(400).json({ errors: "This Category Doesn't Exist" });
    } catch (err) {
      console.error(`[${getCurrentTime()}] Произошла ошибка при удалении категории с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  }
}

class UserController {
  async getAll(req, res) {
    console.log(req.user);
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
      const users = await userModel.getAll();
      console.log(`[${getCurrentTime()}] Запрос пользователей успешно обработан.`);
      return res.json(users);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить пользователей: ${err}.`);
      return res.status(500).end();
    }
  }

  async create(req, res) {
    const { body } = req;
    try {
      const newId = await userModel.create(body);
      console.log(`[${getCurrentTime()}] Добавлен новый пользователь с ID: ${newId}.`);
      return res.status(201).end();
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Пользователь с таким именем уже зарегистрирован.`);
        return res.status(400).json({ errors: 'This Username is not available' });
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при регистрации пользователя: ${err}.`);
      return res.status(500).end();
    }
  }

  async login(req, res) {
    const { body } = req;
    const { username } = body;
    try {
      const result = await userModel.login(body);
      if (result) {
        const { id, user_role_id: userRoleId } = result;
        const token = generateAccessToken(id, userRoleId);
        console.log(`[${getCurrentTime()}] Выполнен вход пользователя ${username}`);
        return res.status(200).json({ token, username });
      }
      console.error(`[${getCurrentTime()}] Неправильный пароль пользователя ${username}`);
      return res.status(401).json();
    } catch (err) {
      if (err.message === 'No data returned from the query.') {
        console.error(`[${getCurrentTime()}] Пользователь ${username} не существует`);
        return res.status(401).json();
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при авторизации ${err}.`);
      return res.status(500).end();
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    try {
      const result = await userModel.delete(id);
      if (result) {
        console.log(`[${getCurrentTime()}] Успешно удален пользователь с ID: ${id}.`);
        return res.status(204).end();
      }
      console.error(`[${getCurrentTime()}] Данный пользователь не существует`);
      return res.status(400).json({ errors: "This User Doesn't Exist" });
    } catch (err) {
      console.error(`[${getCurrentTime()}] Произошла ошибка при удалении пользователя с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  }
}

module.exports.questionController = new QuestionController();
module.exports.categoryController = new CategoryController();
module.exports.userController = new UserController();
