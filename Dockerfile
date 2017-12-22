# Download Node.js
FROM node:9.3

# Create directories
RUN mkdir /var/app
WORKDIR /var/app

# Copy package.json and npm install packages
COPY package.json /var/app/package.json
COPY package-lock.json /var/app/package-lock.json

# Install PM2 manager for production
RUN npm install
RUN npm install pm2 -g

# Set application volume
VOLUME /var/app