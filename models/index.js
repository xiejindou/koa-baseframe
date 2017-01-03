'use strict';

/**
 * Module dependencies.
 */
const fs = require('fs');
const path = require('path');
const config = require('../config');
const Sequelize = require('sequelize');
const logger = require('../libs/logger').getLogger('db');

const sequelize = new Sequelize(config.db_uri, {
    // dialect: 'mysql', // 或者 'postgres',用于指明所用的数据库类型
    pool: {
        minConnections: 0,
        maxConnections: 5,
        maxIdleTime: 10000
    },
    logging: function (msg){
        // 需要的时候开启trace层级的调试
        logger.trace(msg);
    }
});

let models = {
    sequelize: sequelize,
    db: sequelize, // alias
    exec: function* (sql, args) { // 可直接执行原生sql语句
        var options = {replacements: args};
        var data = yield this.sequelize.query(sql, options);
        if (/select |returning/i.test(sql)) {
            return data[0];
        }
        return data[1];
    }
};

let fileList = fs.readdirSync(__dirname);
logger.trace(fileList);
fileList.forEach(function(fileName) { // 除了index.js之外的所有文件都被认为是数据库模型文件
  //logger.debug(fileName);
  if (fileName !== 'index.js' && fileName.indexOf('.js') !== -1) {
    let modelName = fileName.split('.js')[0];
    models[modelName] = sequelize.import(path.join(__dirname, fileName));
    logger.trace('import model', modelName);
  }
});

module.exports = models;
