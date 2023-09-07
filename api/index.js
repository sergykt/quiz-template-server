#!/usr/bin/env node

const Express = require('express');
const cors = require('cors');

const data = require('./src/data');
const routes = require('./src/routes.js');

const { questions, categories } = data;

const getLastId = (array) => array[array.length - 1]?.id || 1;

const app = new Express();

app.use(cors())
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get(routes.data(), (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.json(data);
});

app.get(routes.quiz(), (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.json(questions);
});

app.post(routes.questions(), (req, res) => {
  const id = getLastId(questions) + 1;
  const { body } = req;
  const {
    text,
    answer,
    wrongAnswer,
    recommendation,
    category,
  } = body;

  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  if (text && answer && wrongAnswer && recommendation && category && answer !== wrongAnswer) {
    const data = { text, options: [answer, wrongAnswer], answer, recommendation, category, id };
    questions.push(data);
    res.status(201).json(data);
  } else {
    res.status(400).end();
  }
});

app.put(routes.questionsEdit(), (req, res) => {
  const id = Number(req.params.id);
  const questionIndex = questions.findIndex((item) => item.id === id);
  const { body } = req;
  const {
    text,
    answer,
    wrongAnswer,
    recommendation,
    category,
  } = body;

  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  if (text && answer && wrongAnswer && recommendation && category, answer !== wrongAnswer) {
    const data = { text, options: [answer, wrongAnswer], answer, recommendation, category, id };
    questions[questionIndex] = data;
    res.status(202).json(data);
  } else {
    res.status(400).end();
  }
});

app.delete(routes.questionsEdit(), (req, res) => {
  const id = Number(req.params.id);
  const questionIndex = questions.findIndex((item) => item.id === id);
  if (questionIndex) {
    questions.splice(questionIndex, 1);
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.status(204).end();
  } else {
    res.status(400).end();
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
