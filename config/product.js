/**
 *  项目配置文件 ( 测试环境 )
 */
const Redis = require('ioredis');
"use strict";
module.exports = {
    "port": 5043,
    "timeout": 30 * 20 * 1000,
    "db_uri": "postgres://postgres:gL@sql2016@127.0.0.1:5432/db_name",
    "db_log_uri": "mongodb://localhost:27017/skill_logs",
    "log": {
        "level": "debug"
    },
    "redis": new Redis({
        host: "127.0.0.1",
        port: 6379,
        db: "1"
    }),
    "redisSession": { // session 使用的redis
        "host": "127.0.0.1",
        "port": 6379,
        "db": "7"
    },
    "pw_salt": "487_ji3kdiUjide2U",
    "host": "http://dev.szshanlian.com",  //后面不能加斜杠
    "defaultUserHead": '/img/default_head.png', // 用户的默认头像
    "sessionKey": "skills_app:sess",
    "cookieKey": "skills_app:sess"
};