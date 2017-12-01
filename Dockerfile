FROM node:8

# Create directories
RUN mkdir /var/app
WORKDIR /var/app

# Copy package.json and npm install packages
COPY package.json /var/app/package.json
COPY package-lock.json /var/app/package-lock.json

RUN npm install
RUN npm install pm2 -g

VOLUME /var/app