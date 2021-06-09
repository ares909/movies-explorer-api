const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const messages = require('../utils/messages');
const UnauthorizedError = require('../errors/unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (str) => validator.isEmail(str),
      message: messages.user.isEmailValid,
    },
  },
  password: {
    type: String,
    required: true,
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
        throw new UnauthorizedError(messages.login.isValid);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(messages.login.isValid);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
