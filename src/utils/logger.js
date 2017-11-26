const winston = require('winston');

const timestampFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: timestampFormat,
      colorize: true
    })
  ]
});

module.exports = logger;
