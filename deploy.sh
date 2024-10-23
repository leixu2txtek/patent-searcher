#!/bin/bash

echo "开始安装依赖包..."
npm install > /dev/null 2>&1

echo "开始打包..."
npm run build > /dev/null 2>&1

echo "开始启动镜像服务..."
mv ./dist ./docker
docker-compose -f ./docker/docker-compose.yaml up --build