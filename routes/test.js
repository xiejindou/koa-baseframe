"use strict"

var router = require('koa-router')();
const logger = require('../utils/logger');

router.get('/', function*() {
    this.body = "Welcom to test !";
});

router.get('/hello',function *(){
	this.body = "hello to Koa";
});

router.get('/haha.php',function *(){
	this.body = "I am not php ...";
});

module.exports = router;
