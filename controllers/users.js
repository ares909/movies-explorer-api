const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const messages = require('../utils/messages');
const NotFoundError = require('../errors/notfound');
const BadRequestError = require('../errors/badrequest');
const ConflictError = require('../errors/conflict');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUNDS = 10;
const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user })
    .orFail(() => new NotFoundError(messages.user.id.userNotFound))
    .then((user) => res.send({ name: user.name, email: user.email }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError(messages.user.allFilled);
  }
  bcrypt.hash(req.body.password, SOLT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE && err.name === 'MongoError') {
        next(new ConflictError(messages.user.sameData));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(messages.user.isValid));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, email },

    {
      new: true,
      runValidators: true,

    },
  ).then((user) => res.send(user))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE && err.name === 'MongoError') {
        next(new ConflictError(messages.user.sameData));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(messages.user.isValid));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        // secure: true,
        sameSite: 'none',
      });

      res.send({ email: user.email });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: messages.logout.onLogout })
    .end();
};

module.exports = {
  createUser, getUser, updateUser, login, logout,
};
