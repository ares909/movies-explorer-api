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
    .then((movie) => res.send({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailer,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,

    }))
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
        throw new ForbiddenError(messages.movie.id.userNotFound);
      }
      return Movie.deleteOne(movie)
        .then(() => res.send({ message: messages.movie.onDelete }))
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            next(new BadRequestError(messages.movie.isValid));
          } else {
            next(err);
          }
        });
    })

    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
