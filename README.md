# broken-app

### **Compilation errors**

1 - "./controllers/usercontroller.js" : 1, ReferenceError: Router is not defined
````
var router = Router() -> const router = require('express').Router()
````
2 - "./controllers/usercontroller.js" : 2, Error: Cannot find module 'bcrypt'
````
var bcrypt = require('bcrypt') -> const bcrypt = require('bcryptjs')
````
3 - "./controllers/usercontroller.js" : 5, TypeError: require(...).import is not a function
````
var User = require('../db').import('../models/user') -> const User = require('../models/user')
````
4 - "./controllers/gamecontroller.js" : 2, TypeError: require(...).import is not a function
````
var Game = require('../db').import('../models/game') -> const Game = require('../models/game')
````
5 - "./models/game.js" : 1, SyntaxError: Function statements require a function name
````
function(sequelize, DataTypes) { ... } -> module.exports = function(sequelize, DataTypes) { ... }
````
6 - "./controllers/gamecontroller.js" : 116, ReferenceError: routers is not defined
````
module.exports = routers -> module.exports = router
````
7 - "app.js" : 8, TypeError: db.sync is not a function
````
db.sync()
````
for solution add in './db':
```` 
module.exports = sequelize;
````
8 - "./middleware/validate-session.js" : 2, TypeError: require(...).import is not a function
````
var User = require('sequelize').import('../models/user') -> const User = require('../models/user')
````
*** 
#### **After fixing compilation errors**
````
App is listening on 4000
````
***
### **Logic errors**

1 - "app.js" : 13, Missing first argument in **app.listen(port, callback)**

````
app.listen(function() { ... }) -> app.listen(4000, function() { ... })
````
2 - "app.js" : 8, **db.sync()** is asynchronous, so let's wrap it in an asynchronous function:
````
const start = async () => {
  try {
    await db.sync({ force: true });
    app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`));
  } catch (err) {
    console.error(err.message);
  }
};
````

3 - "app.js" : 9, Incorrect use of middleware for parsing
````
app.use(require('body-parser'));
````
must be replaced with:
````
app.use(require('body-parser').json());
````
or (the best way)
````
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
````

4.a* - "./models/user.js" : 1, not define a User model
In "./models/user.ls" we have a function that creates and define a User model, but the model itself is not created or defined.
Let's create a model and export it.
To do this, we will create two requirements:
````
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
````

Replace the existing unnamed function with a nominal arrow:
````
module.exports = function(sequelize, DataTypes) { ... } -> const createUserModel = (sequelize, DataTypes) => { ... }
````

Create and define a model and export it:
````
module.exports = createUserModel(sequelize, DataTypes);
````

4.b* - "./models/game.js" : 1, not define a Game model
In "./models/game.ls" we have a function that creates and define a Game model, but the model itself is not created or defined.
Let's create a model and export it.
To do this, we will create two requirements:
````
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
````

Replace the existing unnamed function with a nominal arrow:
````
module.exports = function(sequelize, DataTypes) { ... } -> const createGameModel = (sequelize, DataTypes) => { ... }
````
Create and define a model and export it:
````
module.exports = createGameModel(sequelize, DataTypes);
````

4.c* - "app.js" : 6, There are no definable models to sync with the database using **model.sync(options)**
Exporting the User model and the Game model to **app.js** lines 11, 12:
````
const User = require('./models/user');
const Game = require('./models/game');
````

5 - "./db.js" : 1 Incorrect require Sequelize class
````
const Sequelize = require('sequelize') -> const { Sequelize } = require('sequelize')
````

6 - "./controllers/usercontroller.js" : 11, Field name error:
````
passwordhash: bcrypt.hashSync(req.body.user.password, 10) -> passwordHash: bcrypt.hashSync(req.body.user.password, 10)
````

7 - "./controllers/usercontroller.js" : 9, 10, 11, 12, Error in processing the object **req.body**.
A non-existent field is specified **user**.
````
User.create({
        full_name: req.body.user.full_name,
        username: req.body.user.username,
        passwordHash: bcrypt.hashSync(req.body.user.password, 10),
        email: req.body.user.email,
    })
````
replace with:
````
User.create({
        full_name: req.body.full_name,
        username: req.body.username,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
    })
````

8 - "./controllers/usercontroller.js" : 30, 32 Error in processing the object **req.body**.
A non-existent field is specified **user**.
````youtrack
30. User.findOne({ where: { username: req.body.user.username } })
32. bcrypt.compare(req.body.user.password, user.passwordHash, function (err, matches)
````
replace with:
````
30. User.findOne({ where: { username: req.body.username } })
32. bcrypt.compare(req.body.password, user.passwordHash, function (err, matches)
````

9 - "./controllers/gamecontroller.js" : 7, Incorrectly committed parameter **data** in **function findSuccess**:
````
function findSuccess(data) {
    res.status(200).json({
       games: games,
       message: "Data fetched."
    })
}
````
replace with:
````
function findSuccess(games) {
    res.status(200).json({
       games: games,
       message: "Data fetched."
    })
}
````

10 - "./controllers/gamecontroller.js" : 41-46, Error in processing the object **req.body**.
A non-existent field is specified **game**.
````
Game.create({
        title: req.body.game.title,
        owner_id: req.body.user.id,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    })
````
replace with:
````
Game.create({
        title: req.body.title,
        owner_id: req.user.id,
        studio: req.body.studio,
        esrb_rating: req.body.esrb_rating,
        user_rating: req.body.user_rating,
        have_played: req.body.have_played,
    })
````

10a - "./controllers/gamecontroller.js" : 64-68, Error in processing the object **req.body**.
A non-existent field is specified **game**.
````
Game.update({
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    }
````
replace width:
````
Game.update({
        title: req.body.title,
        studio: req.body.studio,
        esrb_rating: req.body.esrb_rating,
        user_rating: req.body.user_rating,
        have_played: req.body.have_played
    }
````

11 - "./controllers/gamecontroller.js" : 73, Missing id field in **req.user** object:
````
{
   where: {
     id: req.params.id,
     owner_id: req.user
    }
}
````
fix it:
````
{
   where: {
     id: req.params.id,
     owner_id: req.user.id
    }
}
````

***
#### **Bugs are fixed, the application works correctly.**
***

### **Refactoring code**

1 - in **"app.js"** lines 1-5 replace **var** with **const**
in line 5 added semicolon: 
````
const game = require('./controllers/gamecontroller');
````

2 - In **"./models/user.js : 1**, Replace the existing unnamed function with a nominal arrow
````
module.exports = function(sequelize, DataTypes) { ... } -> const createUserModel = (sequelize, DataTypes) => { ... }
````
in line 26 added semicolon.

3 - In **"./models/game.js : 1**, Replace the existing unnamed function with a nominal arrow
````
module.exports = function(sequelize, DataTypes) { ... } -> const createGameModel = (sequelize, DataTypes) => { ... }
````
in line 38 added semicolon.

4 - In **"./db.js" : 3, 4** let's translate the parameters into a global variable **. env **
In line 2 added:
````
require('dotenv').config();
````
In line 4:
````
const {
  DB, DB_PORT, DB_HOST, DB_USER, DB_PASSWORD,
} = process.env;
````
and replace it:
````
const sequelize = new Sequelize('gamedb', 'postgres', 'ghastb0i', {
    host: 'localhost',
    dialect: 'postgres'
})
````
with
````
const sequelize = new Sequelize(DB, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  port: DB_PORT,
});
````
in line 1:
````
const Sequelize = require('sequelize') -> const { Sequelize } = require('sequelize')
````
in lines 9, 13 - replace function expression with arrow-function:
````
function success() {
    console.log('Connected to DB');
  },

  function fail(err) {
    console.log(`Error: ${err}`);
  }
````
after
````
() => console.log('Connected to DB'),

(err) => console.log(`Error: ${err}`),
````
Added semicolon in lines 6, 16

5 - In **"./controllers/usercontroller.js" : 3** replace **var** with **const**:
````
var jwt = require('jsonwebtoken') -> const jwt = require('jsonwebtoken')
````
in lines 15, 23, Replace function expression with arrow-function:
````
function signupSuccess(user) {
   const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
      res.status(200).json({
         user: user,
         token: token,
      )
},

function signupFail(err) {
   res.status(500).send(err.message)
}
````
after:
````
(user) => {
   const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
   res.status(200).json({
      user,
      token,
   });
},

(err) => {
   res.status(500).send(err.message);
},
````

in line 34 - replace **var** with **const**:
````youtrack
var token = jwt.sign( ... ) -> const token = jwt.sign( ... )
````

6 - In **"./controllers/gamecontroller.js" : 1** replace **var** with **const**:
````
var router = require('express').Router() -> const router = require('express').Router()
````
in lines 7, 14, 25, 31, 49, 56, 77, 84, 101, 108 Replace function expression with arrow-function:
example before:
````
function findSuccess(games) {
   res.status(200).json({
       games: games,
       message: "Data fetched."
   )
},

function findFail() {
   res.status(500).json({
       message: "Data not found"
   })
}
````
after
````youtrack
(games) => res.status(200).json({ games, message: 'Data fetched.' }),
() => res.status(500).json({ message: 'Data not found' }),
````

7 - In **"./middleware/validate-session.js" : 8** replace **var** with **const**:
````
var sessionToken = req.headers.authorization -> const sessionToken = req.headers.authorization
````
in line 5 Replacement of a non-strict comparison with a strict one:
````
if (req.method == 'OPTIONS') { ... } -> if (req.method === 'OPTIONS') { ... }
````
in line 16, 17, 21, 24, 29 Added semicolon.
