"use strict";

const bytes = require('bytes');
const utils = require('../libs/utils');
const logger = require('../libs/logger');
const createError = require('http-errors');
const uuid = require('uuid');

module.exports = {
  requestLogger: async (ctx,next) => {
    let start = Date.now();
    await next();
    let duration = Date.now() - start;
    let len = ctx.length;
    let length;
    // get the human readable response length
    if (~[204, 205, 304].indexOf(ctx.status)) {
      length = '';
    } else if (null == len) {
      length = '-';
    } else {
      length = bytes(len);
    }
    if (/^\/(activity|css|dist|fonts|js|src|text|res|img).*/.test(ctx.req.url)==false){
      let reqInfo = {
        duration: duration,
        uid: ctx.uid,
        req_url: ctx.req.url,
        req_type: ctx.req.method,
        req_cookie: ctx.req.headers.cookie,
        req_user_agent: ctx.req.headers["user-agent"],
        req_body: ctx.request.body,
        res_content_length: ctx.response.header["content-length"],
        res_content_type: ctx.response.header["content-type"],
        res_last_modified: ctx.response.header["last-modified"],
        res_status_code: ctx.res.statusCode, 
        res_body: ctx.body
      };
      ctx.log.info(reqInfo,"请求信息");
    }
  },
  errorHandler: async (ctx,next) => {  // 错误处理中间件
    try {
      await next();
    } catch (err) {
      if (err.status && err.status < 500) {
        logger.warn(err.stack || err);
      } else {
        logger.error(err.stack || err);
      }
      ctx.status = err.status || 500;
      let message = err.message || 'Internal Server Error';
      ctx.body = {code: ctx.status, err: JSON.stringify(message) || 'error', out: {}};
    }
  },
  defaultHandler: async (ctx,next) =>{ // 默认处理方式
    await next();
    if (ctx.path == '/' ){
      ctx.body = "Welcom to root";
    }else{
      if (ctx.body===undefined){
        await ctx.render('web/404');
      }
    }
  },
  requestUuid: async (ctx,next) => {
      ctx.req_id = uuid.v1();
      ctx.log = logger.child({reqId:ctx.req_id});
      await next();
      ctx.set('ReqId', ctx.req_id);
  }
};
