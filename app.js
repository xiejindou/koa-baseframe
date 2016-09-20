"use strict";

//region require
const app = require('koa')();
const json = require('koa-json');
const hbs = require('koa-hbs');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const timeout = require('koa-timeout');
const parser = require('koa-body');
const serve = require('koa-static');
const config = require('./config');
const util = require('./utils');
const middlewares = require('./middlewares');
const load = require('./utils/load');
//endregion

// 注意npm-shrinkwrap.json
app.use(middlewares.requestUuid);
app.use(serve(__dirname + '/public', {
  setHeaders: function(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  }
}));

app.use(middlewares.requestLogger);
app.use(middlewares.errorHandler);

// timeout
app.use(timeout(config.timeout));

// session
app.keys = ['koa@2016'];
app.use(session({
  store:redisStore({
    host: config.redisSession.host,
    port: config.redisSession.port,
    db: config.redisSession.db,
    keySchema: config.sessionKey
  }),
  key: config.cookieKey
}));

// global middlewares
util.hbs(hbs);

app.use(hbs.middleware({
    viewPath: __dirname + '/views',
    layoutsPath: __dirname + '/views/layouts',
    defaultLayout: 'main',
    disableCache: util.isProduction()  //调试的时候可以禁止缓存
}));

app.use(parser({files: true, multipart: true, fields: true}));
app.use(json({pretty: !util.isProduction()}));

load(app, __dirname + '/routes');

module.exports = app;
