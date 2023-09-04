const Express = require('express');

const questions = require('./src/questions');

const getLastId = () => questions[questions.length - 1].id;

const routes = {
  data: '/api/data',
};

const app = new Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get(routes.data, (req, res) => {
  res.json(questions);
});

app.post(routes.data, (req, res, next) => {
  const id = getLastId() + 1;
  const { body } = req;
  const { text, option1, option2, answer, recommendation } = body;
  const data = { text, options: [option1, option2], answer, recommendation, id };
  questions.push(data);
  res.json(data);
});

app.listen(5001);
