#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const pgp = require('pg-promise')();

const { dbPath } = require('./database');
const addRoutes = require('./routes/index');

const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined'));

const start = async () => {
  try {
    const db = await pgp(dbPath);
    const preparedServer = await addRoutes(app, db);
    preparedServer.listen(PORT);
    console.log(`Server is running on port ${PORT}.`);
  } catch (err) {
    console.error(err);
  }
};

start();
