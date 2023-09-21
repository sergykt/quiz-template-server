const bcrypt = require('bcryptjs');
const { db, tables } = require('../database');

const {
  questionsTable,
  categoriesTable,
  usersTable,
  tokensTable,
  resultsTable,
} = tables;

class QuestionModel {
  constructor(table) {
    this.table = table;
  }

  getAll = async () => {
    try {
      return await db.any(`SELECT * FROM ${this.table} ORDER BY id ASC`);
    } catch (err) {
      throw err;
    }
  }

  getQuiz = async () => {
    try {
      return await db.any(`SELECT * FROM ${this.table} ORDER BY RANDOM() LIMIT 20`);
    } catch (err) {
      throw err;
    }
  }

  create = async (body) => {
    const {
      text,
      answer,
      wrongAnswer,
      recommendation,
      category_id,
    } = body;

    const options = [answer, wrongAnswer];
    options.sort();
    try {
      const result = await db.one(
        `INSERT INTO ${this.table} (text, options, answer, recommendation, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [text, options, answer, recommendation, category_id]
      );
      return result.id;
    } catch (err) {
      throw err;
    };
  }

  update = async (id, body) => {
    const {
      text,
      answer,
      wrongAnswer,
      recommendation,
      category_id,
    } = body;

    const options = [answer, wrongAnswer];
    options.sort();
    try {
      const result = await db.result(
        `UPDATE ${this.table} SET text = $1, options = $2, answer = $3, recommendation = $4, category_id = $5 WHERE id = $6`,
        [text, options, answer, recommendation, category_id, id]
      );
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    };
  }

  delete = async (id) => {
    try {
      const result = await db.result(`DELETE FROM ${this.table} WHERE id = $1`, id);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }
}

class CategoryModel {
  constructor(table) {
    this.table = table;
  }

  getAll = async () => {
    try {
      return await db.any(`SELECT * FROM ${this.table} ORDER BY id ASC`);
    } catch (err) {
      throw err;
    }
  }

  create = async (body) => {
    const { name } = body;
    try {
      const result = await db.one(`INSERT INTO ${this.table} (name) VALUES ($1) RETURNING id`, name);
      return result.id;
    } catch (err) {
      throw err;
    };
  }

  update = async (id, body) => {
    const { name } = body;
    try {
      const result = await db.result(`UPDATE ${this.table} SET name = $1 WHERE id = $2`, [name, id]);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    };
  }

  delete = async (id) => {
    try {
      const result = await db.result(`DELETE FROM ${this.table} WHERE id = $1`, id);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }
}

class UserModel {
  constructor(table) {
    this.table = table;
  }

  get = async (id) => {
    try {
      const userData = await db.any(`SELECT * FROM ${this.table} WHERE id = $1`, id);
      return userData.length > 0 ? userData[0] : null;
    } catch (err) {
      throw err;
    }
  }

  getAll = async () => {
    try {
      return await db.any(`SELECT * FROM ${this.table} ORDER BY id ASC`);
    } catch (err) {
      throw err;
    }
  }

  create = async (body) => {
    const { username, password } = body;
    const userRoleId = body.userRoleId || 2;
    try {
      const hashPassword = await bcrypt.hash(password, 8);
      const result = await db.one(
        `INSERT INTO ${this.table} (username, password, user_role_id) VALUES ($1, $2, $3) RETURNING id, user_role_id, username`,
        [username, hashPassword, userRoleId]
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  login = async (body) => {
    const { username, password } = body;
    try {
      const currentUser = await db.one(`SELECT * FROM ${this.table} WHERE username = $1`, username);
      const auth = await bcrypt.compare(password, currentUser.password);
      if (!auth) {
        throw new Error('Wrong password');
      }
      return currentUser;
    } catch (err) {
      throw err;
    }
  }

  delete = async (id) => {
    try {
      const result = await db.result(`DELETE FROM ${this.table} WHERE id = $1`, id);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }
}

class TokenModel {
  constructor(table) {
    this.table = table;
  }

  get = async (userId) => {
    try {
      const user = await db.any(`SELECT * FROM ${this.table} WHERE user_id = $1`, userId);
      return user.length > 0 ? user[0] : null;
    } catch (err) {
      throw err;
    }
  };

  create = async (userId, refreshToken) => {
    try {
      await db.one(
        `INSERT INTO ${this.table} (user_id, refresh_token) VALUES ($1, $2) returning user_id`,
        [userId, refreshToken]
      );
    } catch (err) {
      throw err;
    }
  };

  update = async (userId, refreshToken) => {
    try {
      await db.none(
        `UPDATE ${this.table} SET refresh_token = $1 WHERE user_id = $2`,
        [refreshToken, userId]
      );
    } catch (err) {
      throw err;
    };
  };

  delete = async (userId) => {
    try {
      const result = await db.result(`DELETE FROM ${this.table} WHERE user_id = $1`, userId);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }

  findToken = async (refreshToken) => {
    try {
      return await db.one(`SELECT * FROM ${this.table} WHERE refresh_token = $1`, refreshToken);
    } catch (err) {
      throw err;
    }
  }
}

class ResultModel {
  constructor(table) {
    this.table = table;
  }

  get = async (userId) => {
    try {
      return await db.any(`SELECT id, points, created_at AS date FROM ${this.table} WHERE user_id = $1 ORDER BY created_at ASC`, userId);
    } catch (err) {
      throw err;
    }
  }

  create = async (userId, points) => {
    try {
      return await db.one(
        `INSERT INTO ${this.table} (user_id, points) VALUES ($1, $2) returning id`,
        [userId, points]);
    } catch (err) {
      throw err;
    }
  }
}

module.exports.questionModel = new QuestionModel(questionsTable);
module.exports.categoryModel = new CategoryModel(categoriesTable);
module.exports.userModel = new UserModel(usersTable);
module.exports.tokenModel = new TokenModel(tokensTable);
module.exports.resultModel = new ResultModel(resultsTable);
