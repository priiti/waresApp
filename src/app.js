const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/routes');

const app = express();
const isTestEnvironment = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';

if (!isTestEnvironment) {
  app.use(morgan('dev'));
}

app.set('port', process.env.APP_PORT || 8092);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const notFound = (req, res) => res.status(404).send('Not Found');
const errorHandler = (err, req, res, next) => res.status(err.status || 500).json({
  message: err.message,
  errors: err.errors || undefined,
  stack: isProduction ? undefined : err.stack
});

app.use('/api', routes, notFound, errorHandler);

module.exports = app;
