const router = require('express').Router();
const {
  createCard, getCard, deleteCard,
  likeCard, dislikeCard,
} = require('../controllers/card');

router.get('/cards', getCard);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;