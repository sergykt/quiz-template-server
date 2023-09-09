const dbName = 'quiz';
const username = 'serg';
const password = '83hivofo';
const host = 'localhost';
const port = 5432;

//const dbPath = process.env.NODE_ENV === 'production' ? 'postgres://serg:Fl9qQ2C10uibfWSo0edYXKyNadafeDOa@dpg-cjub0vnhdsdc73ekctug-a.oregon-postgres.render.com/quiz_template_server_sql' : `postgres://${username}:${password}@${host}:${port}/${dbName}`;

const dbPath = 'postgres://serg:Fl9qQ2C10uibfWSo0edYXKyNadafeDOa@dpg-cjub0vnhdsdc73ekctug-a.oregon-postgres.render.com/quiz_template_server_sql';

module.exports = dbPath;
