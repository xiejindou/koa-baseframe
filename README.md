# koa-min-server-electron
基于 koa-min-server 直接改造的electron客户端程序

### 基础环境  
- electron > 1.3.9
- 开发环境安装： `npm install electron-prebuilt -g`

### 用git下载并安装运行  
- 1.执行命令下载：`git clone -b min-electron git@github.com:muguang-lijing/koa-baseframe.git koa-min-server-electron`
- 2.进入项目目录安装运行 `cd koa-min-server-electron && npm install && electron .`

### electron　后的变化地方　　
- `/main.js` electron相关代码
- `/public/electron.html` electron 窗口启动后首先加载的页面
- `/app.js` 增加一行代码　`const electron = require('./main');` 引入electron相关代码
---  
#### 需要注意点　　
- 最好使用npm装包
