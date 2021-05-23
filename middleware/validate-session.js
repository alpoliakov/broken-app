const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const { SECRET_KEY } = process.env;

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next(); // allowing options as a method for request
  } else {
    // We use the Bearer method of authorization when making requests through the Postman
    const headerResult = req.headers.authorization;

    if (!headerResult) return res.status(403).send({ auth: false, message: 'No token provided.' });

    const sessionToken = headerResult.split(' ')[1];
    console.log(sessionToken);
    if (!sessionToken) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(sessionToken, SECRET_KEY, (err, decoded) => {
      if (decoded) {
        User.findOne({ where: { id: decoded.id } })
          .then((user) => {
            req.user = user;
            console.log(`user: ${user}`);
            next();
          },
        () => {
          res.status(401).send({ error: 'not authorized' });
        });
      } else {
        res.status(400).send({ error: 'not authorized' });
      }
    });
  }
};
