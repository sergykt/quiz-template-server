const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const addRoutes = require('./routes/index');

const plugin = async (app) => {
  try {
    const allowedOrigins = ['https://quiz-template-seven.vercel.app']
    const corsOptions = {
      origin: allowedOrigins,
      credentials: true,
    };

    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use(morgan('combined'));
    await addRoutes(app);

    return app;
  } catch (err) {
    throw err;
  }
};

module.exports = plugin;
