# broken-app

### **Compilation errors**

1 - "./controllers/usercontroller.js" : 1 ReferenceError: Router is not defined
````
var router = Router() -> const router = require('express').Router()
````
2 - "./controllers/usercontroller.js" : 2 Error: Cannot find module 'bcrypt'
````
var bcrypt = require('bcrypt') -> const bcrypt = require('bcryptjs')
````
3 - "./controllers/usercontroller.js" : 5 TypeError: require(...).import is not a function
````
var User = require('../db').import('../models/user') -> const User = require('../models/user')
````
4 - "./controllers/gamecontroller.js" : 2 TypeError: require(...).import is not a function
````
var Game = require('../db').import('../models/game') -> const Game = require('../models/game')
````
5 - "./models/game.js" : 1 SyntaxError: Function statements require a function name
````
function(sequelize, DataTypes) { ... } -> module.exports = function(sequelize, DataTypes) { ... }
````
6 - "./controllers/gamecontroller.js" : 116 ReferenceError: routers is not defined
````
module.exports = routers -> module.exports = router
````
7 - "app.js" : 8 TypeError: db.sync is not a function
````
db.sync()
````
for solution add in './db':
```` 
module.exports = sequelize;
````
8 - "./middleware/validate-session.js" : 2 TypeError: require(...).import is not a function
````
var User = require('sequelize').import('../models/user') -> const User = require('../models/user')
````
*** 
#### **After fixing compilation errors**
````
App is listening on 4000
````
