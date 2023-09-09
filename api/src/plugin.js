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
  
    const db = await pgp(dbPath);

    console.log('Database connected successfully.');

    addRoutes(app, db);

    return app;
  } catch (err) {
    throw err;
  }
};

module.exports = plugin;
