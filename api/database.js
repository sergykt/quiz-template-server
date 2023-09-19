const pgp = require('pg-promise')();

const dbName = process.env.POSTGRES_DATABASE;
const username = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT;

let dbPath = `postgres://${username}:${password}@${host}:${port}/${dbName}`;
dbPath = process.env.NODE_ENV === 'production' ? `${dbPath}?sslmode=required` : dbPath;

const tables = {
  questionsTable: 'questions',
  categoriesTable: 'categories',
  usersTable: 'users',
  tokensTable: 'tokens',
};

const db = pgp(dbPath);

module.exports= { db, tables };
