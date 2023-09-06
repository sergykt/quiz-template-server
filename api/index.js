#!/usr/bin/env node

const Express = require('express');
const cors = require('cors');

const questions = require('../src/questions');

const getLastId = () => questions[questions.length - 1].id;

const routes = {
  data: '/api/data',
};

const app = new Express();

app.use(cors())
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get(routes.data, (req, res) => {
  res.json(questions);
  res.end();
});

app.post(routes.data, (req, res) => {
  const id = getLastId() + 1;
  const { body } = req;
  const { text, option1, option2, answer, recommendation } = body;
  const data = { text, options: [option1, option2], answer, recommendation, id };
  questions.push(data);
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.json(data);
  res.end();
});

app.listen(5001);
