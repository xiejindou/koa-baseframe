"use strict"

var router = require('koa-router')();
const logger = require('../utils/logger');

router.get('/', function*() {
    this.body = "Welcom to test !";
});

module.exports = router;
