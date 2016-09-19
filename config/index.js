/**
 * Created by calvin on 6/14/16.
 */
"use strict";
module.exports = {
    "port": 5042,
    "timeout": 10000,
    "appUrl": "http://mix.localtest.com",
    "postgresDbName": "app_tongj",
    "postgresMinConnections": 1,
    "postgresMaxConnections": 2,
    "postgresMaxIdleTime": 30000,
    "postgresMaster": {
        "host": "127.0.0.1",
        "port": 5432,
        "username": "postgres",
        "password": "postgres"
    },
    "postgresSlave": {
        "host": "127.0.0.1",
        "port": 5432,
        "username": "postgres",
        "password": "postgres"
    },
    "redis": {
        "host": "127.0.0.1",
        "port": 6379,
        "db": "8"
    },
    "redisSession": {
        "host":"127.0.0.1",
        "port":6379,
        "db":"8"
    },
    "mongodb":{
        "db_name":"student",
        "host":"127.0.0.1",
        "port":27017
    },
    "indexPath": "/index.html",
    "log": {
        "level": "debug"
    },
    "sessionKey": "tongj_app:sess",
    "cookieKey": "tongj_app:sess",
    "metaName": "tongj_app_script_key"
};

