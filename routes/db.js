"use strict"

const router = require('koa-router')();
const nedb = require('nedb');
const db = new nedb({
    filename: './data/test.db', // data目录可以不用提前建立，若没有会自动建立
    autoload: true
});

//　插入数据,?age=23
router.get('/add/:name',function *(){
    yield new Promise(resolve => {
        db.insert({
            name: this.params.name,
            age: this.query.age
        },(err,ret)=>{
            if (!err){
                resolve();
            }
        });
    });
    this.body = "ok";
});

//　查询数据
router.get('/get/:name',function *(){
    let out = yield new Promise(resolve => {
        db.findOne({
            name: this.params.name
        },(err,ret)=>{
            if (!err){
                resolve(ret);
            }else{
                console.log("get error:"+JSON.stringify(err));
            }
        });
    });
    this.body = out; // 若没有该值，则为null
});

//　删除该名字的所有记录
router.get('/del/:name',function *(){
    yield new Promise(resolve => {
        // 删除多项
        db.remove({
            name: this.params.name
        }, {
            multi: true
        }, (err, ret) => {
            if (!err){
                resolve();
            }
        });
    });
    this.body = "ok";
});

module.exports = router;
