const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthError('Необходима авторизация!'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
