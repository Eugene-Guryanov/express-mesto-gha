const User = require('../models/user');

const ERR_BAD_REQUEST = 400;
const ERR_NOT_FOUND = 404;
const ERR_DEFAULT = 500;

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERR_DEFAULT).send({ message: 'Ошибка!' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params.userId, { name, about }, { new: true, runValidators: true })
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params.userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST.send({ message: 'Переданы некорректные данные' }));
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};
