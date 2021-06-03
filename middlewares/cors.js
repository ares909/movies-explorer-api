const router = require('express').Router();
const cors = require('cors');

const originList = [
  'https://khomyakov.nomoredomains.icu',
  'http://khomyakov.nomoredomains.icu',
  'http://localhost:3000',
  'https://localhost:3000',
];

router.use(
  cors({
    origin: originList,
    credentials: true,
  }),
);

module.exports = router;
