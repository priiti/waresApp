const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/routes');
const { notFound, errorHandler } = require('./utils/errorHandlers');
const { jwtCheck } = require('./auth/jwt');

const app = express();
const isTestEnvironment = process.env.NODE_ENV === 'test';

if (!isTestEnvironment) {
  app.use(morgan('dev'));
}

app.set('port', process.env.PORT);

app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', jwtCheck, routes, notFound, errorHandler);

module.exports = app;
