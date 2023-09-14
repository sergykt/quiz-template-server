const morgan = require('morgan');
const cors = require('cors');
const addRoutes = require('./routes/index');

const plugin = async(app) => {
  try {
    app.use(cors());
    app.use(morgan('combined'));
    await addRoutes(app);

    return app;
  } catch (err) {
    throw err;
  }
};

module.exports = plugin;
