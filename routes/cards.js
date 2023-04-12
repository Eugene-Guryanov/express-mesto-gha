const router = require('express').Router();
const {
  createCard, getCard, removeCard,
  likeCard, dislikeCard,
} = require('../controllers/card');

const { cardValidation, idValidation } = require('../middlewares/validation');

router.get('/cards', getCard);
router.post('/cards', cardValidation, createCard);
router.delete('/cards/:id', idValidation, removeCard);
router.put('/cards/:id/likes', idValidation, likeCard);
router.delete('/cards/:id/likes', idValidation, dislikeCard);

module.exports = router;
