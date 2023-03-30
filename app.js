const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const userRouter = require('./routes/users');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '6422e08c6d3424249770e10f',
  };

  next();
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
