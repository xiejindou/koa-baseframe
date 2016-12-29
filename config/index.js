/**
 *  项目配置文件
 */
"use strict";
module.exports = {
    "port": 5042,
    "timeout": 10000,
    // "db_uri": "mysql://root:ljmsql118@127.0.0.1:3306/app_fujing_export",
    "db_uri": "postgres://postgres:postgres@127.0.0.1:5432/export",
    "log": {
        "level": "debug"
    },
    "sessionKey": "tongj_app:sess",
    "cookieKey": "tongj_app:sess",
    "metaName": "tongj_app_script_key"
};

