# koa-baseframe
koa工程级项目架构

### 基础环境  
- node > 4.x.x
- mysql 启动数据库，并创建一个数据库，名称为 export（实际数据库名称需根据 config/index.js 中的配置设置）

### 运行  
- 进入项目目录 运行 `npm install`  
- 修改配置文件，确保 数据库链接字符串正确  
- 同步数据库（新环境第一次运行项目） 运行 `npm run initDb`  
- `npm start`
- 访问 http://127.0.0.1:5042/test

### 目录介绍  
- bin                   项目启动文件以及数据库初始化文件  
- config                配置文件  
- libs                  代码库以及工具包等项目常用代码逻辑  
- middlewares           常用koa中间件的模块化封装  
- models                数据库模型定义相关文件以及与数据库底层相关的操作逻辑,改文件夹下除了index.js文件外其余的都是数据表模型文件，一个文件对应一个表  
- public                静态目录文件夹，一般放置静态页面或资源，改路径下的资源可直接访问而不经路由控制  
- routes                路由控制文件夹，用于放置网站的路由接口代码，采用分级路由结构  
- test                  测试代码文件夹，放置项目的测试代码，用于自动化测试  
- views                 后端输出页面文件夹，该目录下的页面由后端代码生成并经路由控制输出  
- app.js                项目的全局设置及中间件

### 数据库操作
- 项目成功运行后，可依次从上往下执行 routes/orders 中的路由进行测试。关于数据库操作具体可参考：[http://itbilu.com/nodejs/npm/N1yrA4HQW.html](http://itbilu.com/nodejs/npm/N1yrA4HQW.html)

### 日志记录与查看  
- 首先需安装一个命令行工具用于方便查看日志： `npm install -g bunyan`  
- 启动项目并将日志输出到日志文件 `npm run logStart`  
- 进到项目根目录，执行命令以查看日志 `tail -200f log.txt | bunyan -L` ，次命令需要linux命令行，window下的linux shell模拟器也可以  
- 过滤特定等级日志 `tail -200f log.txt | bunyan -l 40` ， 只看level高于40的日志记录  
- 具体参考：[https://npm.taobao.org/package/bunyan#log-method-api](https://npm.taobao.org/package/bunyan#log-method-api)
