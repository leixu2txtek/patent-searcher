FROM docker.io/library/node:20.18.0-slim

# Set work directory 
WORKDIR /app
ADD ../dist/ ./
ADD ../package.json ./
ADD ../package-lock.json ./
ADD ../ecosystem.config.cjs ./
ADD ../src/config ./src/config

RUN npm install
RUN npm install pm2 -g