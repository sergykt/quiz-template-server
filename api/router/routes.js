const apiPath = '/api';

const routes = {
  questions: () => [apiPath, 'questions'].join('/'),
  categories: () => [apiPath, 'categories'].join('/'),
  users: () => [apiPath, 'users'].join('/'),
  userRoles: () => [apiPath, 'user_roles'].join('/'),
};

module.exports = routes;