# Wares - [Wa]rade [Re]gistri[s]üsteem

Back-end application for assets and incidents management in institutions. Built mainly for usage in schools.

### Used stack
- Node.js
- MongoDb
- Redis
- Docker
- JWT

### Instructions to start the application in development mode using Docker

#### Start application
- Clone from GIT

`git clone https://github.com/priiti/waresApp.git`

`cd waresApp`

Create .env file and copy variables from .env.example file

- First time build and run application

`docker-compose up --build`

- Start containers without build

`docker-compose up`

- Stop containers

`docker-compose stop`

#### Run tests in Docker container
Make sure docker is running and containers are up (`docker-compose up`)

- Go into Docker container, run following:

`docker exec -it wares-node bash`

`npm test`

#### Mongo container
- Go into MongoDB container

`docker exec -it wares-mongo bash`

`mongo`

#### API routes
Returns JSON formatted response from server. If jwtEnsure middleware is used in routes.js file, then user must be logged-in / hold valid jwt token.

- GET: /api/assets
  * List of assets
- GET: /api/assets/:assetId
  * Asset by id
- POST: /api/assets/:assetId
  * Add new asset
- GET: /api/rooms
  * List of rooms
- GET: /api/rooms/:roomId
  * Room by id
- POST: /api/rooms
  * Add new room
- PATCH: /api/rooms
  * Update room
- GET: /api/devices/types
  * Returns device types
- GET: /api/devices/types/:typeId
  * Device by id
- POST: /api/devices/types
  * Add new device type
- POST: /api/auth/local/register
  * Register user
- POST: /api/auth/forgot
  * Send password reset request and receive token to email. Mailtrap is used. If there's a need to test, .env variables must be changed in under mail service
- GET: /api/auth/reset/:token
  * Check if token provided by the user is correct and wait for the passwords to be filled
- POST: /api/auth/reset/:token
  * Reset password
- POST: /api/auth/login
  * Login and receive jwt token
- POST: /api/auth/logout
  * Logout, jwt token will be blacklisted in redis
- GET: /api/users
  * List of users
- GET: /api/users/:userId
  * User by id
- POST: /api/users
  * Create new user
- PATCH: /api/users/:userId
  * Update user by id
- GET: /api/incidents
  * List of incidents
- GET: /api/incidents/:id
  * Incident by id
- POST: /api/incidents
  * Create incident