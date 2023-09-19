const { questionModel, categoryModel, userModel, tokenModel } = require('../models/models');
const { getCurrentTime, tokenService } = require('../services/services');

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
        return res.status(409).json({ errors: 'This Question Already Exists' });
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
      return res.status(404).json({ errors: "This Questions Doesn't Exist" });
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Данный вопрос уже существует.`);
        return res.status(409).json({ errors: 'This Question Already Exists' });
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
      return res.status(404).json({ errors: "This Question Doesn't Exist" });
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
        return res.status(409).json({ errors: 'This Category Already Exists' });
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
      return res.status(404).json({ errors: "This Category Doesn't Exist" });
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Данная категория уже существует.`);
        return res.status(409).json({ errors: 'This Category Already Exists' });
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
      return res.status(404).json({ errors: "This Category Doesn't Exist" });
    } catch (err) {
      if (err.code === '23503') {
        console.error(`[${getCurrentTime()}] Категорию с ID: ${id} нельзя удалить, поскольку с ней еще связаны вопросы`);
        return res.status(409).json({ errors: 'The category cannot be deleted because it is still referenced by questions.' });
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при удалении категории с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  }
}

class UserController {
  async getAll(req, res) {
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
      const newUser = await userModel.create(body);
      const { id, user_role_id: userRoleId, username } = newUser;
      const token = tokenService.generateAccessTokens({ id, userRoleId });
      await tokenService.saveToken(id, token.refreshToken);
      console.log(`[${getCurrentTime()}] Добавлен новый пользователь с ID: ${newUser.id}.`);
      res.cookie('refreshToken', token.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'None', httpOnly: true, secure: true });
      return res.status(200).json({ accessToken: token.accessToken, username });
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Пользователь с таким именем уже зарегистрирован.`);
        return res.status(409).json({ errors: 'This Username is not available' });
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при регистрации пользователя: ${err}.`);
      return res.status(500).end();
    }
  }

  async login(req, res) {
    const { body } = req;
    const { username } = body;
    try {
      const user = await userModel.login(body);
      const { id, user_role_id: userRoleId } = user;
      const token = tokenService.generateAccessTokens({ id, userRoleId });
      await tokenService.saveToken(id, token.refreshToken);
      console.log(`[${getCurrentTime()}] Выполнен вход пользователя ${username}`);
      res.cookie('refreshToken', token.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'None', httpOnly: true, secure: true });
      return res.status(200).json({ accessToken: token.accessToken, username });
    } catch (err) {
      if (err.message === 'No data returned from the query.' || err.message === 'Wrong password') {
        console.error(`[${getCurrentTime()}] Неверные данные при выполнении входа ${username}`);
        return res.status(401).json();
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при авторизации ${username} ${err}.`);
      return res.status(500).end();
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
      const token = await tokenModel.findToken(refreshToken);
      const { user_id: userId } = token;
      await tokenModel.delete(userId);
      console.log(`[${getCurrentTime()}] Выполнен выход пользователя с ID: ${userId}`);
      return res.status(200).end();
    } catch (err) {
      if (err.message === 'No data returned from the query.') {
        console.error(`[${getCurrentTime()}] Данный токен не существует`);
        return res.status(404).end();
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при выходе пользователя ${err}.`);
      return res.status(500).end();
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    try {
      const result = await userModel.delete(id);
      await tokenModel.delete(id);
      if (result) {
        console.log(`[${getCurrentTime()}] Успешно удален пользователь с ID: ${id}.`);
        return res.status(204).end();
      }
      console.error(`[${getCurrentTime()}] Данный пользователь не существует`);
      return res.status(404).json({ errors: "This User Doesn't Exist" });
    } catch (err) {
      console.error(`[${getCurrentTime()}] Произошла ошибка при удалении пользователя с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await tokenService.validateRefreshToken(refreshToken);
      const user = await userModel.get(userData.id);
      const { id, user_role_id: userRoleId, username } = user;
      const token = tokenService.generateAccessTokens({ id, userRoleId });
      await tokenService.saveToken(id, token.refreshToken);
      console.log(`[${getCurrentTime()}] Успешно обновлен access token `);
      res.cookie('refreshToken', token.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'None', httpOnly: true, secure: true });
      return res.status(200).json({ accessToken: token.accessToken, username });
    } catch (err) {
      if (err.message === 'Not valid refresh token') {
        console.error(`[${getCurrentTime()}] Невалидный refresh token ${err}.`);
        return res.status(401).end();
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при проверке refresh token ${err}.`);
      return res.status(500).end();
    }
  }
}

module.exports.questionController = new QuestionController();
module.exports.categoryController = new CategoryController();
module.exports.userController = new UserController();
