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
SECRET_KEY=<your secret key to generate the token>
````
- Run the application with the command:
````
npm start
````
  If the application is successfully launched, the following message will be displayed in the terminal:_
  ````
  Connected to DB
  App is running on http://localhost:4000
 ````
- Go to **Postman** and create requests with the following URL:
  - for ````User create```` (POST)
    - ````http://localhost:${PORT}/api/auth/signup````
    
  - for ````User signin ```` (POST)
    - ````http://localhost:${PORT}/api/auth/signin````
    
  _**warning:** For requests with the game entity, you must on the **````Authorization````** field to the request and assign it a token value, which can be taken either when creating a User (````token````) or when entering the User's authorization (````sessionToken````)_
  
  - for ````Game create```` (POST)
    - ````http://localhost:${PORT}/api/game/create````
    
  - to ````get all```` the games of the user (GET)
    - ````http://localhost:${PORT}/api/game/all````
    
  - to get one user ````game```` (GET) (the game **id** is passed as **````Params````**)
    - ````http://localhost:${PORT}/api/game/:id````
    
  - to ````update the game```` (PUT) (the game **id** is passed as **````Params````**)
    - ````http://localhost:${PORT}/api/game/update/:id````
    
  - to ````delete game```` (DELETE) (the game **id** is passed as **````Params````**)
    - ````http://localhost:${PORT}/api/game/remove/:id````
    
  _Requests and responses are implemented in the JSON format._ 
  
  **PORT** - _the port on which your application is running (take from the **.env** file)_ 
