# Wares Node.js app

### Start application
Clone from GIT 

`git clone https://github.com/priiti/waresApp.git`

Build and start Docker

`cd waresApp`

`docker-compose up --build`

Start docker containers:

`docker-compose up`

### Run tests in Docker container 🐳

* Make sure docker is running and container is up (`docker-compose up`)

Go into Docker container, run following:

`docker exec -it WaresNode bash`

`npm test`

### Mongo container
* Go into MongoDB container

`docker exec -it WaresMongo bash`

`mongo`