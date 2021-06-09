const Movie = require('../models/movie');
const messages = require('../utils/messages');
const ForbiddenError = require('../errors/forbidden');
const BadRequestError = require('../errors/badrequest');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail, nameRU, nameEN,
    movieId,
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
    movieId,
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
  Movie.findById({ _id: req.params.movieId })
    .select('+owner')
    .orFail(() => new ForbiddenError(messages.movie.id.movieNotFound))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError(messages.movie.id.userNotFound));
      } else {
        return Movie.deleteOne(movie)
          .then(() => res.send({ message: messages.movie.onDelete }))
          .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
              next(new BadRequestError(messages.movie.isValid));
            } else {
              next(err);
            }
          });
      }
    })

    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
