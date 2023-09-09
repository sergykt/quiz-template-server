const morgan = require('morgan');
const pgp = require('pg-promise')();
const cors = require('cors');

const addRoutes = require('./routes');
const dbPath = require('./database');

const plugin = async (app) => {
  try {
    app.use(cors());
    const logger = morgan('combined');
    app.use(logger);
  
    //const db = await pgp(dbPath);
    const db = await pgb('postgres://default:gBGiZTOL96dw@ep-small-dawn-11427518-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb')

    console.log('Database connected successfully.');

    addRoutes(app, db);

    return app;
  } catch (err) {
    throw err;
  }
};

module.exports = plugin;
