const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const app = express();

app.set('port', process.env.APP_PORT || 8092);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// const notFound = (req, res) => res.status(404).send('Not Found');

app.use('/api', routes);
// app.use('*', notFound);

module.exports = app;
