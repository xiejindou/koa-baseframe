"use strict";

const app = require('koa')();
const json = require('koa-json'); // 以json格式输出
const session = require('koa-session');　// 记录session,保存客户端状态
const parser = require('koa-body'); // 自动解析请求数据为合适的类型
const router = require('./routes');　// 路由模块
const serve = require('koa-static');　// 静态文件服务

// 提供静态文件服务
app.use(serve(__dirname + '/public', {
  setHeaders: function(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  }
}));

// 用于支持session
app.keys = ["koa2017"];
app.use(session(app));

// 处理表单提交,解析post过来的body数据
app.use(parser({files: true, multipart: true, fields: true}));

// 支持json格式化输出
app.use(json({pretty: true}));

// 使用路由
app.use(router.routes());

app.listen(5043);
console.log("访问 http://127.0.0.1:5043/");
