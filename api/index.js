#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const addRoutes = require('./router/index');

const PORT = process.env.PORT || 5001;

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

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '10mb' }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(limiter);
app.use(cors(corsOptions));
app.use(morgan('combined'));

addRoutes(app);

const start = async () => {
  try {
    app.listen(PORT);
    console.log(`Server is running on port ${PORT}.`);
  } catch (err) {
    console.error(err);
  }
};

start();
