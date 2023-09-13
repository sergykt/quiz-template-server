const { isInputNotEmpty, getCurrentTime } = require('../utilz/index');
const { db, tables } = require('../database');

const { questionsTable, categoriesTable } = tables;

class QuestionModel {
  constructor(table) {
    this.table = table;
  }

  getAll = async() => {
    try {
      return await db.any(`SELECT * FROM ${this.table} ORDER BY id ASC`);
    } catch (err) {
      throw err;
    }
  }

  getQuiz = async() => {
    try {
      return await db.any(`SELECT * FROM ${this.table} ORDER BY RANDOM() LIMIT 20`);
    } catch (err) {
      throw err;
    }
  }

  create = async(body) => {
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
          `INSERT INTO ${this.table} (text, options, answer, recommendation, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [text, options, answer, recommendation, category_id]
        );
        return result.id;
      } catch (err) {
        throw err;
      };
    } else {
      throw new Error('Invalid data');
    }
  }

  update = async(id, body) => {
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
          `UPDATE ${this.table} SET text = $1, options = $2, answer = $3, recommendation = $4, category_id = $5 WHERE id = $6`,
          [text, options, answer, recommendation, category_id, id]
        );
        return result.rowCount;
      } catch (err) {
        throw err;
      };
    } else {
      throw new Error('Invalid data');
    }
  }

  delete = async(id) => {
    if (id) {
      try {
        const result = await db.result(`DELETE FROM ${this.table} WHERE id = $1`, id);
        return result.rowCount;
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('Invalid data');
    }
  }
}

class CategoryModel {
  constructor(table) {
    this.table = table;
  }

  getAll = async() => {
    try {
      return await db.any(`SELECT * FROM ${this.table} ORDER BY id ASC`);
    } catch (err) {
      throw err;
    }
  }

  create = async(body) => {
    const { name } = body;
    if (name) {
      try {
        const result = await db.one(`INSERT INTO ${this.table} (name) VALUES ($1) RETURNING id`, name);
        return result.id;
      } catch (err) {
        throw err;
      };
    } else {
      throw new Error('Invalid data');
    }
  }

  update = async(id, body) => {
    const { name } = body;
    if (name) {
      try {
        const result = await db.result(`UPDATE ${this.table} SET name = $1 WHERE id = $2`, [name, id]);
        return result.rowCount;
      } catch (err) {
        throw err;
      };
    } else {
      throw new Error('Invalid data');
    }
  }

  delete = async(id) => {
    if (id) {
      try {
        const result = await db.result(`DELETE FROM ${this.table} WHERE id = $1`, id);
        return result.rowCount;
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('Invalid data');
    }
  }
}

module.exports.questionModel = new QuestionModel(questionsTable);
module.exports.categoryModel = new CategoryModel(categoriesTable);
