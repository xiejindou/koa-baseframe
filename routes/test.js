"use strict"

const router = require('koa-router')();
const logger = require('../libs/logger');

router.get('/', function*() {
    this.body = "Welcom to test !";
});

router.get('/hello',function *(){
	this.body = "hello to Koa";
});

router.get('/haha.php',function *(){
	this.body = "I am not php ...";
});

router.get('/log',function *(){
	logger.fatal("big error");
	logger.info("Begin run");
	logger.error("fail to run");
	logger.debug("test run");
	logger.warn("will fail");
	logger.info({
		name: "testB",
		grade: {
			math: 23,
			chinese: 22
		}
	});
	this.body = "ok";
});

module.exports = router;
