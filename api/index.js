#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const plugin = require('./plugin');

const PORT = process.env.PORT || 5001;

const app = express();
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.raw({ type: 'application/octet-stream' , limit: '10mb' }));

const start = async () => {
  try {
    const preparedServer = await plugin(app);
    preparedServer.listen(PORT);
    console.log(`Server is running on port ${PORT}.`);
  } catch (err) {
    console.error(err);
  }
};

start();
