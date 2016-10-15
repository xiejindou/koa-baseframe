# koa-server
一个更精简的 koa web 服务

### 基础环境  
- node > 4.x.x

### 用git下载并安装运行  
- 1.执行命令下载：`git clone -b develop git@github.com:muguang-lijing/koa-baseframe.git koa-server`
- 2.进入项目目录安装运行 `cd koa-server && npm install && npm start`
- 3.访问 http://127.0.0.1:5042/hello

### 结构介绍  
- 路由。采用分级路由结构，路由文件位于routes目录下，路由文件名为该路由文件下所有路由的基路由，例如，test.js路由文件下'/hello'的访问路由是：'/test/hello'

