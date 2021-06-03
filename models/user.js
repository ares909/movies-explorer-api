const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Иванов Иван',
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (str) => validator.isEmail(str),
      message: 'некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    unique: true,
    select: false,
  },

  __v: {
    type: Number,
    select: false,
  },

});
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
