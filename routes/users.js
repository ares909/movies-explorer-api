const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getUsers, createUser, getUser, updateUser, login, logout,
} = require('../controllers/users');
const { validatePassword } = require('../utils/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email().trim(true),
    password: Joi.string().required().min(8).trim(true)
      .custom(validatePassword, 'custom validation'),
  }),
}), createUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(validatePassword, 'custom validation'),
  }),
}), login);
router.post('/logout', logout);

module.exports = router;
