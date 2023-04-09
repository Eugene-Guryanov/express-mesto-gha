const router = require('express').Router();
const {
  getUser, getUserById,
  updateUser, updateUserAvatar, getMe,
} = require('../controllers/user');

router.get('/users', getUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);
router.get('/users/me', getMe);

module.exports = router;
