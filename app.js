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

app.use((req, res, next) => {
  req.user = {
    _id: '6422e08c6d3424249770e10f',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', (req, res) => {
  res.status(ERR_NOT_FOUND)
    .send({ message: 'По указоннуму url ничего нет' });
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
