#!/usr/bin/env node

const Express = require('express');
const plugin = require('./src/plugin');

const app = new Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001;

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
