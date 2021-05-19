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

4.c* "app.js" : 6, There are no definable models to sync with the database using **model.sync(options)**
Exporting the User model and the Game model to **app.js** lines 11, 12:
````
const User = require('./models/user');
const Game = require('./models/game');
````

5. "./db.js" : 1 Incorrect require Sequelize class
````youtrack
const Sequelize = require('sequelize') -> const { Sequelize } = require('sequelize')
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

3 - In **"./db.js" : 3, 4** let's translate the parameters into a global variable **. env **
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
Added semicolon in lines 6, 16
