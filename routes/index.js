const { errors } = require('celebrate');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');
const messages = require('../utils/messages');

const { createUser, login, logout } = require('../controllers/users');
const { validatePassword } = require('../utils/validation');
const middlewares = require('../middlewares');
const { errorHandler } = require('../middlewares/error-handler');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const NotFoundError = require('../errors/notfound');

router.use(requestLogger);
router.use(middlewares);
router.use('/users', auth, users);
router.use('/movies', auth, movies);

router.use(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email().trim(true),
      password: Joi.string()
        .required()
        .min(8)
        .trim(true)
        .custom(validatePassword, 'custom validation'),
    }),
  }),
  createUser,
);
router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(validatePassword, 'custom validation'),
  }),
}), login);

router.use('/logout', logout);
router.use(() => {
  throw new NotFoundError(messages.route.isExist);
});
router.use(errorLogger);
router.use(errors());
router.use(errorHandler);

module.exports = router;
