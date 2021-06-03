const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { validateUrl } = require('../utils/validation');

router.get('/', getMovies);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
  deleteMovie,
);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().trim(true).required(),
      director: Joi.string().trim(true).required(),
      duration: Joi.number().required(),
      year: Joi.string().trim(true).required(),
      description: Joi.string().trim(true).required(),
      image: Joi.string()
        .required()
        .trim(true)
        .custom(validateUrl, 'custom validation'),
      trailer: Joi.string()
        .required()
        .trim(true)
        .custom(validateUrl, 'custom validation'),
      thumbnail: Joi.string()
        .required()
        .trim(true)
        .custom(validateUrl, 'custom validation'),
      nameRU: Joi.string().trim(true).required(),
      nameEN: Joi.string().trim(true).required(),
    }),
  }),
  createMovie,
);

module.exports = router;
