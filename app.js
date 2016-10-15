"use strict";

const app = require('koa')();
const json = require('koa-json');
const session = require('koa-session');
const parser = require('koa-body');
const router = require('koa-router');
const serve = require('koa-static');

app.use(serve(__dirname + '/public', {
  setHeaders: function(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  }
}));

app.keys = [config.cookieKey];
app.use(session(app));

app.use(parser({files: true, multipart: true, fields: true}));

app.use(json({pretty: !util.isProduction()}));

app.use(router.routes());

app.listen(5042);
console.log("server run at:5042");
