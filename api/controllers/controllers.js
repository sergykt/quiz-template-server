const {
  questionModel,
  categoryModel,
  userModel,
  tokenModel,
  resultModel,
  userLinkModel
} = require('../models/models');
const {
  getCurrentTime,
  tokenService,
  mailService
} = require('../services/services');

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
      const { id, username, email } = newUser;
      const newLink = await userLinkModel.create(id);
      const fullLink = `${process.env.CLIENT_URL}/verify/?verifyToken=${newLink}`;
      await mailService.sendActivateLink(username, email, fullLink);
      console.log(`[${getCurrentTime()}] Добавлен новый пользователь с ID: ${id}.`);
      return res.status(201).json({ id });
    } catch (err) {
      if (err.code === '23505') {
        console.error(`[${getCurrentTime()}] Пользователь с таким именем или e-mail уже зарегистрирован.`);
        return res.status(409).json({ errors: 'This Username or E-mail is not available' });
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при регистрации пользователя: ${err}.`);
      return res.status(500).end();
    }
  }

  async verify(req, res) {
    const { verifyToken } = req.body;
    if (!verifyToken) {
      console.error(`[${getCurrentTime()}] Ссылка недействительна`);
      return res.status(404).send('Ссылка недействительна');
    }
    try {
      const userId = await userLinkModel.getUserId(verifyToken);
      if (!userId) {
        console.error(`[${getCurrentTime()}] Ссылка недействительна`);
        return res.status(404).send('Ссылка недействительна');
      }
      const user = await userModel.activate(userId);
      await userLinkModel.delete(verifyToken);
      const { user_role_id: userRoleId, username } = user;
      const token = tokenService.generateAccessTokens({ id: userId, userRoleId });
      await tokenService.saveToken(userId, token.refreshToken);
      console.log(`[${getCurrentTime()}] Пользователь с ID ${userId} активирован`);
      res.cookie('refreshToken', token.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'None', httpOnly: true, secure: true });
      return res.status(200).json({ accessToken: token.accessToken, username });
    } catch (err) {
      console.error(`[${getCurrentTime()}] Произошла ошибка при активации ${err}.`);
      return res.status(500).end();
    }
  }

  async login(req, res) {
    const { body } = req;
    const { username } = body;
    try {
      const user = await userModel.login(body);
      const { id, user_role_id: userRoleId, isactive } = user;
      if (!isactive) {
        console.log(`[${getCurrentTime()}] Пользователь ${username} не подтвержден`);
        return res.status(403).json({ id });
      }
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
      if (!refreshToken) {
        return res.status(404).end();
      }
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

  async sendLink(req, res) {
    const { id } = req.body;
    try {
      const user = await userModel.get(id);
      const { username, email } = user;
      const link = await userLinkModel.getLink(id);
      const fullLink = `${process.env.CLIENT_URL}/verify/?verifyToken=${link}`;
      await mailService.sendActivateLink(username, email, fullLink);
      console.log(`[${getCurrentTime()}] Отправлено письмо для верификации пользователя с ID: ${id}.`);
      return res.status(200).end();
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось отправить ссылку для верификации пользователя с ID ${id} ${err}.`);
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
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(401).end();
      }
      console.error(`[${getCurrentTime()}] Произошла ошибка при проверке refresh token ${err}.`);
      return res.status(500).end();
    }
  }

  async getResults(req, res) {
    const { id } = req.user;
    try {
      const results = await resultModel.get(id);
      console.log(`[${getCurrentTime()}] Успешно отправлены результаты пользователя с ID ${id}`);
      return res.json(results);
    } catch (err) {
      console.error(`[${getCurrentTime()}] Произошла ошибка при отправлении результатов пользователя с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  }

  async addResults(req, res) {
    const { id } = req.user;
    const { points } = req.body;
    try {
      await resultModel.create(id, points);
      console.log(`[${getCurrentTime()}] Успешно добавлены результаты пользователя с ID ${id}`);
      return res.status(200).end();
    } catch (err) {
      console.error(`[${getCurrentTime()}] Произошла ошибка при добавлении результатов пользователя с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  }

  async sendResults(req, res) {
    const { id } = req.user;
    try {
      const user = await userModel.get(id);
      const { email, username } = user;
      await mailService.sendResults(username, email, req.body);
      console.log(`[${getCurrentTime()}] Успешно отправлены результаты на e-mail пользователя с ID ${id}`);
      return res.status(200).end();
    } catch (err) {
      console.error(`[${getCurrentTime()}] Произошла ошибка при отправлении результатов на e-mail пользователя с ID: ${id} ${err}.`);
      return res.status(500).end();
    }
  }
}

module.exports.questionController = new QuestionController();
module.exports.categoryController = new CategoryController();
module.exports.userController = new UserController();
