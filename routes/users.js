const router = require('express').Router();
const {
  getUser, getUserById,
  updateUser, updateUserAvatar, getMe,
} = require('../controllers/user');

const {
  idValidation, userInfoValidation, userAvatarValidation,
} = require('../middlewares/validation');

router.get('/users', getUser);
router.get('/users/me', getMe);
router.get('/users/:id', idValidation, getUserById);
router.patch('/users/me', userInfoValidation, updateUser);
router.patch('/users/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = router;
