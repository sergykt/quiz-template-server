const { check, param, validationResult } = require('express-validator');
const { getCurrentTime, tokenService } = require('../services/services');

const trimFields = (req, res, next) => {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  }
  next();
};

const authMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.error(`[${getCurrentTime()}] Пользователь не авторизован`);
      return res.status(401).end();
    }
    const decodedData = tokenService.validateAccessToken(token);
    req.user = decodedData;
    next();
  } catch (err) {
    console.error(`[${getCurrentTime()}] Пользователь не авторизован`);
    return res.status(401).end();
  }
};

const adminMiddleware = (req, res, next) => {
  const { id, userRoleId } = req.user;
  if (req.method === 'OPTIONS') {
    next();
  }
  if (userRoleId !== '1') {
    console.error(`[${getCurrentTime()}] У пользователя с ID: ${id} нет прав доступа`);
    return res.status(403).end();
  }
  next();
};

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((item) => item.msg);
    console.error(`[${getCurrentTime()}] Невалидные данные:`, message);
    return res.status(400).json({ errors: message });
  }
  next();
};

class QuestionMiddleware {
  validateCreate = [
    check('text').notEmpty().withMessage('Text is required'),
    check('answer').notEmpty().withMessage('Answer is required').custom((value, { req }) => {
      if (value === req.body.wrongAnswer) {
        throw new Error('Answer must be different from Wrong Answer');
      }
      return true;
    }),
    check('wrongAnswer').notEmpty().withMessage('Wrong Answer is required'),
    check('recommendation').notEmpty().withMessage('Recommendation is required'),
    check('category_id').notEmpty().withMessage('Category ID is required')
      .isInt().withMessage('Category ID must be an integer'),
    validateResult,
  ];

  validateUpdate = [
    param('id').isInt().withMessage('ID must be an integer'),
    check('text').notEmpty().withMessage('Text is required'),
    check('answer').notEmpty().withMessage('Answer is required').custom((value, { req }) => {
      if (value === req.body.wrongAnswer) {
        throw new Error('Answer must be different from Wrong Answer');
      }
      return true;
    }),
    check('wrongAnswer').notEmpty().withMessage('Wrong Answer is required'),
    check('recommendation').notEmpty().withMessage('Recommendation is required'),
    check('category_id').notEmpty().withMessage('Category ID is required')
      .isInt().withMessage('Category ID must be an integer'),
    validateResult,
  ];

  validateDelete = [param('id').isInt().withMessage('ID must be an integer'), validateResult];
}

class CategoryMiddleware {
  validateCreate = [
    check('name').notEmpty().withMessage('Name is required'),
    validateResult,
  ];

  validateUpdate = [
    param('id').isInt().withMessage('ID must be an integer'),
    check('name').notEmpty().withMessage('Name is required'),
    validateResult,
  ];

  validateDelete = [param('id').isInt().withMessage('ID must be an integer'), validateResult];
}

class UserMiddleware {
  validateCreate = [
    check('username').notEmpty().withMessage('Username is required')
      .isLength({ min: 4, max: 20 }).withMessage('Username must be from 4 to 20 characters'),
    check('password').notEmpty().withMessage('Password is required')
      .isLength({ min: 5, max: 20 }).withMessage('Password must be from 5 to 20 characters')
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error('Passwords must be the same');
        }
        return true;
      }),
    check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is not valid'),
    check('confirmPassword').notEmpty().withMessage('Password confirmation is required'),
    validateResult
  ];

  validateLogin = [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
    validateResult
  ];

  validateDelete = [param('id').isInt().withMessage('ID must be an integer'), validateResult];

  validateResults = [
    check('points').notEmpty().withMessage('Points is required')
      .isInt().withMessage('Points must be an integer'),
    validateResult
  ];
}

module.exports.trimFields = trimFields;
module.exports.authMiddleware = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
module.exports.questionMiddleware = new QuestionMiddleware();
module.exports.categoryMiddleware = new CategoryMiddleware();
module.exports.userMiddleware = new UserMiddleware();
