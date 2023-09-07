const apiPath = '/api';

const routes = {
  data: () => [apiPath, 'data'].join('/'),
  quiz: () => [apiPath, 'quiz'].join('/'),
  questions: () => [apiPath, 'questions'].join('/'),
  questionsEdit: () => [apiPath, 'questions/:id'].join('/'), 
};

module.exports = routes;
