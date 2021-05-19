const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller');
const authValidate = require('./middleware/validate-session');
// eslint-disable-next-line no-unused-vars
const User = require('./models/user');
// eslint-disable-next-line no-unused-vars
const Game = require('./models/game');

const { PORT } = process.env;

const start = async () => {
  try {
    await db.sync({ force: true });
    app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`));
  } catch (err) {
    console.error(err.message);
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', user);
app.use(authValidate);
app.use('/api/game', game);

start();
