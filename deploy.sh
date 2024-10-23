#!/bin/bash

echo "开始安装依赖包..."
npm install > /dev/null 2>&1

echo "开始打包..."
npm run build > /dev/null 2>&1


# 写入环境变量到.env文件
echo "env=production" > .env
echo "开始启动镜像服务..."

docker-compose -f ./docker-compose.yaml up --build