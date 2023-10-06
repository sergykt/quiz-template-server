const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const addRoutes = require('./routes/index');

const plugin = async (app) => {
  try {
    const allowedOrigins = true;
    const corsOptions = {
      origin: allowedOrigins,
      credentials: true,
    };

    const limiter = rateLimit({
      windowMs: 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    });

    app.set('trust proxy', 1);
    app.use(limiter);
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
