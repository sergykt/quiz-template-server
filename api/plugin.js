const morgan = require('morgan');
const cors = require('cors');
const pgp = require('pg-promise')();
const { dbPath } = require('./database');
const addRoutes = require('./routes/index');

const plugin = async (app) => {
  try {
    app.use(cors());
    app.use(morgan('combined'));
  
    const db = await pgp(dbPath);
    addRoutes(app, db);

    return app;
  } catch (err) {
    throw err;
  }
};

module.exports = plugin;
