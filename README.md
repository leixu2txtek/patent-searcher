# Patent Searcher

## 项目说明
- 该项目为专利搜索服务的后端，包含 用户注册、登录、专利搜索、专利详情、专利导入、专利导出、微信通知等功能

## 调试步骤
1. 通过 npm i 安装依赖
2. 利用 VScode 打开，直接F5 启动调试模式

## 打包
通过 npm run build 生成产物文件至 dist 目录

## 守护进程
1. 服务器安装 PM2 工具（npm i -g pm2）
2. 通过 pm2 startup 开启开机自启动
3. 将目录切换至产物目录， 通过 pm2 start ecosystem.config.js 启动进程守护
4. 执行 pm2 save, 将开启启动进程信息保存，以便下次开机自动启动相关服务

## 提示！

1. 默认端口为 80830
2. 服务启动后监听端口可在 ecosystem.config.js 文件中配置

## Docker Supported

1. npm run build
2. docker build ./ -t patent-search:lastest

## docker-compose 

1. create .env file, and set the environment variables
2. 执行以下命令启动即可

```
docker-compose -f docker-compose.yml up -d
```

## 环境说明

| 环境 | ENV 配置|
| ----- | ------- |
| 开发环境 | development |
| 运营生产环境 | production |