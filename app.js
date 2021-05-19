const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller');
const User = require('./models/user');
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
app.use(require('./middleware/validate-session'))
app.use('/api/game', game);

start();
