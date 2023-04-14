const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.removeCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => { throw new NotFoundError('Карточка с таким id не найдена'); })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.id).then((cards) => res.send(cards));
      } else {
        throw new ForbiddenError('Не хватает прав для удаления!');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некоректные данные при удалении карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate('owner')
    .orFail(() => { throw new NotFoundError('Карточка с таким id не найдена'); })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некоректные данные лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка с таким id не найдена'); })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некоректные данные дизлайка'));
      } else {
        next(err);
      }
    });
};
