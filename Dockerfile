FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/node:20-alpine

# Set work directory 
WORKDIR /app
ADD ./dist ./
ADD ./package.json ./
ADD ./package-lock.json ./
ADD ./ecosystem.config.cjs ./
ADD ./src/config ./src/config

RUN npm install --registry=https://registry.npmmirror.com/
RUN npm install pm2 -g --registry=https://registry.npmmirror.com/