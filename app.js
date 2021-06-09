require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const {
  mongoUrl, mongoParams,
} = require('./utils/mongo-adress');

const { PORT = 3000 } = process.env;
const app = express();
const router = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(mongoUrl, mongoParams);

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
