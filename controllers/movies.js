const Movie = require('../models/movie');
const messages = require('../utils/messages');
const NotFoundError = require('../errors/notfound');
const BadRequestError = require('../errors/badrequest');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(messages.movie.isValid));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findOneAndDelete({ _id: req.params.movieId })
    .orFail(() => new NotFoundError(messages.movie.id.movieNotFound))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        next(new NotFoundError(messages.movie.id.userNotFound));
      }
    })

    .then(() => res.send({ message: messages.movie.onDelete }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(messages.movie.isValid));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
