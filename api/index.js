#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const plugin = require('./plugin');

const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
