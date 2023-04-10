const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user');

const ERR_BAD_REQUEST = 400;
const ERR_AUTH = 401;
const ERR_NOT_FOUND = 404;
const ERR_DEFAULT = 500;

const randomString = crypto
  .randomBytes(16) // сгенерируем случайную последовательность 16 байт (128 бит)
  .toString('hex');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERR_DEFAULT).send({ message: 'Ошибка!' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => res
      .status(ERR_NOT_FOUND)
      .send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERR_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'Данный email уже зарегестрирован!' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  console.log(req.params);
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => res
      .status(ERR_NOT_FOUND)
      .send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => res
      .status(ERR_NOT_FOUND)
      .send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((avatarData) => res.send({ data: avatarData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      const token = jwt.sign({ _id: user._id }, randomString, { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true, // добавили опцию
      })
        .send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res
        .status(ERR_AUTH)
        .send({ message: err.message });
    });
};

module.exports.getMe = (req, res) => {
  User.findById(req.user._id)
    .then((currentUser) => res.send({ currentUser }))
    .catch((err) => res.send(err));
};
