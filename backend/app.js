const { MONGODB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const { signJoiTest } = require('./middlewares/joiValidate');
const errHandle = require('./middlewares/errHandle');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {
  PORT, USERS, CARDS, errNotFound,
} = require('./utils/constants');
const { logger, logPassLint } = require('./utils/miscutils');
const { login, createUser } = require('./controllers/users');

const app = express();
mongoose.connect(MONGODB, { useNewUrlParser: true });

app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => logger(req, res, next, true));
/* ------ CORS middleware starts ------------ */
const allowedCors = [ // Массив доменов, с которых разрешены кросс-доменные запросы
  'localhost:3000', 'localhost:3000/signup', 'localhost:3000/signin',
];
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE'; // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const requestHeaders = req.headers['access-control-request-headers']; // сохраняем список заголовков исходного запроса

  console.log(`Origin: ${origin} / method: ${method} / req headers: ${requestHeaders}`);
  // res.header('Access-Control-Allow-Origin', '*'); // allow all simple requests
  if (allowedCors.includes(origin)) { // проверяем, что источник запроса есть среди разрешённых
    console.log(`Request ${origin} is allowed: ${allowedCors.includes(origin)}`);
    res.header('Access-Control-Allow-Origin', origin); // устанавливаем заголовок, разрешающий запросы с этого источника
  }
  if (method === 'OPTIONS') { // Если это предварительный запрос, добавляем нужные заголовки
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS); // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Headers', requestHeaders); // разрешаем кросс-доменные запросы с этими заголовками
    return res.end(); // завершаем обработку запроса и возвращаем результат клиенту
  }
  return next();
});
/* ------ CORS middleware ends ------------ */

app.post('/signin', signJoiTest(), login);
app.post('/signup', signJoiTest(), createUser);

// роуты, которым нужна авторизация:
app.use(auth);
app.use(USERS, userRouter);
app.use(CARDS, cardRouter);
app.patch('/*', (req, res) => {
  try {
    throw new Error("Path 2 be processed doesn't exist");
  } catch (err) {
    logPassLint(`Error ${errNotFound.num}: ${err}`, true);
    res.status(errNotFound.num).send({ message: errNotFound.msg });
  }
});

app.use(errors());
app.use(errHandle);
app.listen(PORT, () => {
  logPassLint(`App listening on port ${PORT}`, true);
});

module.exports.createCard = (req) => {
  logPassLint(req.user._id, true);
};
