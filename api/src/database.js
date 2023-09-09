const dbName = 'quiz';
const username = 'serg';
const password = '83hivofo';
const host = 'localhost';
const port = 5432;

const dbPath = process.env.NODE_ENV === 'production' ? 'postgres://default:rjVK91PJyMnE@ep-fancy-truth-17218179-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require' : `postgres://${username}:${password}@${host}:${port}/${dbName}`;

module.exports = dbPath;
