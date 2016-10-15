"use strict"

var router = require('koa-router')();

router.get('/hello',function *(){
	this.body = "hello to Koa";
});

router.get('/haha.php',function *(){
	this.body = "I am not php ...";
});

router.post('/getTime',function *(){
	this.body = new Date().toTimeString();
});

module.exports = router;
