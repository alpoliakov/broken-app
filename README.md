# broken-app
### Technologies and tools used
- _**PostgreSQL 13**_
- _**pgAdmin 4**_
- _**Postman**_

### Installation instructions
#### Clone repository
In the CLI, run this command to get files from this repository:
````
git clone https://github.com/alpoliakov/broken-app
````
#### Transitions
After cloning is complete, open the directory containing the app:
````
cd broken-app
````
and go to the branch ````task-3/solution````
````
git checkout task-3/solution
````
#### Install dependencies
````
npm i
or
npm install
````

### Usage
To use you need to install _**PostgreSQL**_ and _**pgAdmin 4**_ depending on the OS installed on your device. 
This can be done by following [this link](https://www.enterprisedb.com/downloads/postgresql).

You also need to install the _**Postman**_ client application by clicking on [this link](https://www.getpostman.com/).

- **PostgreSQL** should work on ````localhost````, on ````5433```` port.
- Create user.
- Run pgAdmin4.
- Start the DB server through the **pgAdmin** application.
- Create database with ````gamedb```` name.

- In the root of the project, you need to create a **.env** file and register the following global variables in it:
````
PORT=4000<port number for express server>
DB=gamedb<your database name>
DB_USER=<your username>
DB_PASSWORD=<your password>
DB_HOST=localhost
DB_PORT=5433
````
- Run the application with the command:
````
npm start
````
- Go to **Postman** and create requests with the following URL:
  - for ````User create```` (POST)
    - ````http://localhost:${PORT}/api/auth/signup````
    
  - for ````User signin ```` (POST)
    - ````http://localhost:${PORT}/api/auth/signin````
    
  _**warning:** For requests with the game entity, you must add the **authorization** field to the request **Headers** and assign it the value of the token created in the User._
  
  - for ````Game create```` (POST)
    - ````http://localhost:${PORT}/api/game/create````
    
  - to ````get all```` the games of the user (GET)
    - ````http://localhost:${PORT}/api/game/all````
    
  - to get one user ````game```` (GET)
    - ````http://localhost:${PORT}/api/game/:id````
    
  - to ````update the game```` (PUT)
    - ````http://localhost:${PORT}/api/game/update/:id````
    
  - to ````delete game```` (DELETE)
    - ````http://localhost:${PORT}/api/game/remove/:id````
    
  _Requests and responses are implemented in the JSON format._ 
  
  **PORT** - _the port on which your application is running (take from the **.env** file)_ 

### Compilation errors

- **1** - **"./controllers/usercontroller.js" : line 1**, ReferenceError: Router is not defined
````
var router = Router() -> const router = require('express').Router()
````
- **2** - **"./controllers/usercontroller.js" : line 2**, Error: Cannot find module 'bcrypt'
````
var bcrypt = require('bcrypt') -> const bcrypt = require('bcryptjs')
````
or install the bcrypt package as a dependency
````
"dependencies": {
    "bcrypt": "^5.0.1",
    ....
  },
````
- **3** - **"./controllers/usercontroller.js" : line 5**, TypeError: require(...).import is not a function
````
var User = require('../db').import('../models/user') -> const User = require('../models/user')
````
- **4** - **"./controllers/gamecontroller.js" : line 2**, TypeError: require(...).import is not a function
````
var Game = require('../db').import('../models/game') -> const Game = require('../models/game')
````
- **5** - **"./models/game.js" : line 1**, SyntaxError: Function statements require a function name
````
function(sequelize, DataTypes) { ... } -> module.exports = function(sequelize, DataTypes) { ... }
````
- **6** - **"./controllers/gamecontroller.js" : line 116**, ReferenceError: routers is not defined
````
module.exports = routers -> module.exports = router
````
- **7** - **"app.js" : line 8**, TypeError: db.sync is not a function
````
db.sync()
````
for solution add in **'./db'**:
```` 
module.exports = sequelize;
````
- **8** - **"./middleware/validate-session.js" : line 2**, TypeError: require(...).import is not a function
````
var User = require('sequelize').import('../models/user') -> const User = require('../models/user')
````
*** 
#### _After fixing compilation errors:_
````
App is listening on 4000
````


***
### Logic errors
- **1** - **"package.json"** To successfully work with the database via **Sequelize**, you need to update the **pg** package to the latest version.
````
"dependencies": {
    ...
    "pg": "^8.6.0",
    ...
  },
````
- **2** - **"app.js" : line 13**, Missing first argument **port** in **app.listen(port, callback)**
````
app.listen(function() { ... }) -> app.listen(4000, function() { ... })
````

- **3** - **"app.js" : line 8**, **db.sync()** is asynchronous, so let's wrap it in an asynchronous function:
````
const start = async () => {
  try {
    await db.sync();
    app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`));
  } catch (err) {
    console.error(err.message);
  }
};
````

- **4** - **"app.js" : line 9**, Incorrect use of middleware for parsing json-object:
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
````

- **5.a*** - **"./models/user.js" : line 1**, not define a User model
In "./models/user.ls" we have a function that creates and define a User model, but the model itself is not created or defined.
Let's create a model and export it.
To do this, we will create two requirements:
````
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
````

Replace the existing unnamed function with a nominal arrow function:
````
module.exports = function(sequelize, DataTypes) { ... } -> const createUserModel = (sequelize, DataTypes) => { ... }
````

Create and define a model and export it:
````
module.exports = createUserModel(sequelize, DataTypes);
````

- **5.b*** - **"./models/game.js" : line 1**, not define a Game model
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

- **5.c*** - **"app.js" : line 6**, There are no definable models to sync with the database using **model.sync(options)**
Exporting the User model, and the Game model to **app.js** lines 11, 12:
````
const User = require('./models/user');
const Game = require('./models/game');
````

- **6** - **"./controllers/usercontroller.js" : line 11**, Field name error:
````
passwordhash: bcrypt.hashSync(req.body.user.password, 10) -> passwordHash: bcrypt.hashSync(req.body.user.password, 10)
````

- **7** - **"./controllers/gamecontroller.js" : line 42**, Error in assigning **user ID** to the field **owner_id**.
the **user ID** must be taken from the **req** after passing validation.
````
Game.create({
        ...
        owner_id: req.body.user.id,
        ....
    })
````
replace with:
````
Game.create({
        ...
        owner_id: req.user.id,
        ...
    })
````

- **8** - **"./controllers/gamecontroller.js" : line 7**, Incorrectly committed parameter **data** in **function findSuccess**:
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

- **9** - **"./controllers/gamecontroller.js" : line 73**, Missing id field in **req.user** object:
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
#### _Bugs are fixed, the application works correctly._
***

### Refactoring code

- **1** - In **"app.js" lines 1-5** - Replace **var** with **const**
**in line 5** - added semicolon: 
````
const game = require('./controllers/gamecontroller');
````

- **2** - In **"./models/user.js : line 1** - Replace the existing unnamed function with a nominal arrow
````
module.exports = function(sequelize, DataTypes) { ... } -> const createUserModel = (sequelize, DataTypes) => { ... }
````
**in line 26** - added semicolon.

- **3** - In **"./models/game.js : line 1** - Replace the existing unnamed function with a nominal arrow
````
module.exports = function(sequelize, DataTypes) { ... } -> const createGameModel = (sequelize, DataTypes) => { ... }
````
**in line 38** - added semicolon.

- **4** - In **"./db.js" : lines 3, 4** - Let's translate the parameters into a global variable **.env**
**in line 2** - added:
````
require('dotenv').config();
````
**in line 4:**
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
**in line 1:** - We fix the requirement for getting the class and wrap the naming in curly brackets:
````
const Sequelize = require('sequelize') -> const { Sequelize } = require('sequelize')
````
**in lines 9, 13** - Replace functions expression with arrow-function:
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
**in lines 6, 16** - Added semicolon.

- **5** - In **"./controllers/usercontroller.js" : line 3** - Replace **var** with **const**:
````
var jwt = require('jsonwebtoken') -> const jwt = require('jsonwebtoken')
````

**in lines 15, 23** - Replace function expression with arrow-function:
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

**in line 34** - Replace **var** with **const**:
````
var token = jwt.sign( ... ) -> const token = jwt.sign( ... )
````

**in lines 17** - Changed the status code upon successful creation of the user from **200** to **201**.
before:
````
function signupSuccess(user) {
    let token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
    res.status(200).json({ user: user, token: token })
},
```` 
after:
````
(user) => {
    let token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
    res.status(201).json({ user: user, token: token })
},
````

- **6** - In **"./controllers/gamecontroller.js" : line 1** - Replace **var** with **const**:
````
var router = require('express').Router() -> const router = require('express').Router()
````

**in lines 32** - Changed the status code in the absence of a response from **500** to **404**.
before
````
function findFail(err) {
   res.status(500).json({
       message: "Data not found."
   })
}
````
after:
````
(err) => res.status(404).json({ message: 'Data not found.', err: err.message })
````

**in lines 49** - Changed the status code upon successful creation of the game from **200** to **201**.
before:
````
function createSuccess(game) {
   res.status(200).json({
       game: game,
       message: "Game created."
   })
},
```` 
after:
````
(game) => res.status(201).json({ game, message: 'Game created.' }),
````

**in lines 7, 14, 25, 31, 49, 56, 77, 84, 101, 108** - Replace function expression with arrow-function:
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
````
(games) => res.status(200).json({ games, message: 'Data fetched.' }),
() => res.status(500).json({ message: 'Data not found' }),
````

- **7** - In **"./middleware/validate-session.js" : line 8** - Replace **var** with **const**:
````
var sessionToken = req.headers.authorization -> const sessionToken = req.headers.authorization
````
**in line 5** - Replacement of a non-strict comparison with a strict one:
````
if (req.method == 'OPTIONS') { ... } -> if (req.method === 'OPTIONS') { ... }
````
**in line 16, 17, 21, 24, 29** - Added semicolon.
