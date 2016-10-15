"use strict";

const app = require('koa')();
const json = require('koa-json');
const session = require('koa-session');
const parser = require('koa-body');
const router = require('./routes');
const serve = require('koa-static');

// 提供静态文件服务
app.use(serve(__dirname + '/public', {
  setHeaders: function(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  }
}));

// 用于支持session
app.keys = ["koa2016"];
app.use(session(app));

// 处理表单提交,解析post过来的body数据
app.use(parser({files: true, multipart: true, fields: true}));

// 支持json格式化输出
app.use(json({pretty: true}));

// 使用路由
app.use(router.routes());

app.listen(5042);
console.log("访问 http://127.0.0.1:5042/");
