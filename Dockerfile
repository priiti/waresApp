# Download Node.js
FROM node:9.3

# Create directories
RUN mkdir /var/app

# Application environment, will be overridden to development in docker-compose
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Application ports
ARG PORT=8092
ENV PORT $PORT
EXPOSE $PORT

# Healtcheck whether container is working properly
HEALTHCHECK CMD curl -fs http://localhost:$PORT/api/healthz || exit 1

WORKDIR /var/app

# Copy package.json and npm install packages
COPY package.json /var/app/package.json
COPY package-lock.json /var/app/package-lock.json

# Install dependencies
RUN npm install && npm cache clean --force
RUN npm install pm2 -g

# Set application volume
VOLUME /var/app