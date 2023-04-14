const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
module.exports.urlRegExp = /(http:\/\/|https:\/\/)(www)*[a-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\.(ru|com)(:\d{2,5})?((\/.+)+)?\/?#?/;

module.exports.userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().pattern(this.urlRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(this.urlRegExp),
  }),
});

module.exports.userInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(this.urlRegExp),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.idValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});
