# Wares - [Wa]rade [Re]gistri[s]üsteem

Back-end application for assets and incidents management in institutions. Built for usage in schools.

### Used stack
- Node.js
- MongoDb
- Redis
- Docker
- JWT

### Find the instructions below to start the application in development mode using Docker

#### Start application
- Clone from GIT

`git clone https://github.com/priiti/waresApp.git`

`cd waresApp`

- Build containers

`docker-compose build`

- Start containers:

`docker-compose up`

#### Run tests in Docker container
Make sure docker is running and containers are up (`docker-compose up`)

- Go into Docker container, run following:

`docker exec -it wares-node bash`

`npm test`

#### Mongo container
Go into MongoDB container

`docker exec -it wares-mongo bash`

`mongo`
