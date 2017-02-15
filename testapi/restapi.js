"use strict"

const router = require('koa-router')();

/**
 * @api {get} /user/:id 请求用户信息
 * @apiVersion 0.0.1
 * @apiName GetUser
 * @apiGroup User
 * 
 * @apiParam {Number} id 用户唯一标识
 * 
 * @apiSuccess {String} name 用户姓名
 * @apiSuccess {string} age 用户年龄
 * 
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *  "name": "lijing",
 *  "age": 25
 * }
 * 
 * @apiError UserNotFound 指定id的用户未找到
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "error": "UserNotFound"
 * }
 */
router.get('/user/:id',function *(){
    // TODO
});

/**
 * @api {post} /user/login 用户登录
 * @apiVersion 0.0.1
 * @apiName UserLogin
 * @apiGroup User
 * 
 * @apiParam {String} name 用户名
 * @apiParam {String} pwd 用户登录密码
 * 
 * @apiSuccess {String} err 错误信息，如果登录成功该值为空
 * @apiSuccess {Object} out 用户相关数据，主要为用户id
 * @apiSuccessExample {json} 成功时返回的结果：
 * {err: "",out: {id: "xxx"}} 
 * {err: "用户密码错误"}
 * {err: "用户不存在"} 
 */
router.post('/user/login',function *(){
    // TODO
});

module.exports = router;