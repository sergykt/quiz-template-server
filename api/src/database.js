const dbName = 'quiz';
const username = 'serg';
const password = '83hivofo';
const host = 'localhost';
const port = 5432;

const dbPath = process.env.NODE_ENV === 'production' ? 'postgres://default:gBGiZTOL96dw@ep-small-dawn-11427518-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb' : `postgres://${username}:${password}@${host}:${port}/${dbName}`;

module.exports = dbPath;
