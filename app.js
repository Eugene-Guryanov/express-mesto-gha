require('dotenv').config();

const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./routes/users');

const ERR_NOT_FOUND = 404;

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRouter);
app.use(cardRouter);
app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', (req, res) => {
  res.status(ERR_NOT_FOUND)
    .send({ message: 'По указоннуму url ничего нет' });
});

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
