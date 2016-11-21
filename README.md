# koa-min-server-electron
基于 koa-min-server 直接改造的electron客户端程序

### 基础环境  
- electron > 1.3.9
- 开发环境安装： `npm install electron-prebuilt -g`

### 用git下载并安装运行  
- 1.执行命令下载：`git clone -b min-electron git@github.com:muguang-lijing/koa-baseframe.git koa-min-server-electron`
- 2.进入项目目录安装运行 `cd koa-min-server-electron && npm install && electron .`

### 结构介绍  
- `/public` 静态文件目录，里面的内容可以直接访问  
- `/routes` 路由文件目录，后端处理逻辑写在此处  
- `app.js`  项目启动文件  
- `package.json` 项目配置文件  

### electron　后的变化地方　　
- `/main.js` electron相关代码
- `/public/electron.html` electron 窗口启动后首先加载的页面
- `/app.js` 增加一行代码　`const electron = require('./main');` 引入electron相关代码
