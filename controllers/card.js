const Card = require('../models/card');

const ERR_BAD_REQUEST = 400;
const ERR_NOT_FOUND = 404;
const ERR_DEFAULT = 500;

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERR_DEFAULT).send({ message: 'Ошибка!' }));
};

module.exports.removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }))
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cards) => res.send(cards));
      } else {
        res.status(ERR_BAD_REQUEST).send({ message: 'Ошибка удаления' });
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }))
  .then((likes) => res.send({ data: likes }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные лайка' });
    } else {
      res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
    }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }))
  .then((likes) => res.send({ data: likes }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные дизлайка' });
    } else {
      res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
    }
    });
};
