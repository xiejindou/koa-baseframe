# koa-min-server
一个最精简的 koa web 服务

### 基础环境  
- node > 4.x.x

### 用git下载并安装运行  
- 1.执行命令下载：`git clone -b min git@github.com:muguang-lijing/koa-baseframe.git koa-min-server`
- 2.进入项目目录安装运行 `cd koa-min-server && npm install && npm start`
- 3.访问 http://127.0.0.1:5042 或者 http://127.0.0.1:5042/hello

### 结构介绍  
- `/public` 静态文件目录，里面的内容可以直接访问  
- `/routes` 路由文件目录，后端处理逻辑写在此处  
- `app.js`  项目启动文件  
- `package.json` 项目配置文件  
