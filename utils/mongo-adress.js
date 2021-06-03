const mongoUrl = 'mongodb://localhost:27017/filmsexplorer';
const mongoParams = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };

module.exports = {
  mongoUrl, mongoParams,
};
