const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3005 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/filmsexplorer", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
