require('dotenv').config();

const express = require('express');

const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-unresolved
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { loginValidation, userValidation } = require('./middlewares/validation');
// eslint-disable-next-line import/no-unresolved, import/extensions
const { login, createUser } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);
app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);

app.use('*', auth, () => {
  throw new NotFoundError('По указаному url ничего нет');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
