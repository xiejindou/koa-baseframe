'use strict';

const Router = require('koa-router');
const router = new Router();
const log = require('../libs/logger').tag('test');
const config = require('../config');
const redis = config.redis;

router.get('/', ctx => {
//  this.redirect("/dist/pc/login.html");
    ctx.body = "test ok";
});

router.get('/redis', ctx => {
    ctx.body = "test ok";
});

router.get('/exit', ctx => {
    process.exit(0);
});

module.exports = router;