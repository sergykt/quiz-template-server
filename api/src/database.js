const dbName = 'quiz';
const username = 'serg';
const password = '83hivofo';
const host = 'localhost';
const port = 5432;

const dbPath = `postgres://${username}:${password}@${host}:${port}/${dbName}`;

module.exports = dbPath;
