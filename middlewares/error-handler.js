const messages = require('../utils/messages');
// eslint-disable-next-line no-unused-vars
const errorHandler = ((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  return res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? messages.error.onError
        : message,
    });
});

module.exports = {
  errorHandler,
};
