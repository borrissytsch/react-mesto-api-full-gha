const winston = require('winston');
const expressWinston = require('express-winston');
const { reqLogFName, errLogFName } = require('../utils/constants');

// логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: reqLogFName }),
  ],
  format: winston.format.json(),
});
// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: errLogFName }),
  ],
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };
