FROM node:20.18.0-slim

# Change deb source list to Aliyun mirror
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list
RUN sed -i 's|security.debian.org/debian-security|mirrors.aliyun.com/debian-security|g' /etc/apt/sources.list

# Install dependencies for chrome
RUN apt-get update
RUN apt-get install -yq locales

RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && locale-gen en_US.UTF-8

# Set environment variables
ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8

# Set work directory 
WORKDIR /app
ADD ./dist/ .

RUN npm install
RUN npm install pm2 -g