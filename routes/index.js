"use strict"
const util = require('util');

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

router.get('/jsontest',function *(){
	this.body = {
		name: 'lijing',
		age: 25
	};
});

router.post('/posttest',function *(){
	// let str = "";
	// this.req.on('data',thunk=>{
	// 	str+=thunk;
	// });
	// this.req.on('end',()=>{
	// 	console.log("RequestRawData:"+str);
	// });
	console.log("RequestBody:"+JSON.stringify(this.request.body));
	console.log("RequestBodyType:"+(typeof this.request.body));
	this.body = "ok";
});

router.get('/sessionTest',function *(){
	let n = this.session.views || 0;
	this.session.views = ++n;
	this.body = `第${n-1}次访问`;
});

module.exports = router;
