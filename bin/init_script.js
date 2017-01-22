// 初始化数据库，线上部署时只能调用一次
'use strict';

var models = require('../models');
var co = require('co');

co(function*() {
    yield models.sequelize.sync({
        force:false,
        logging: console.log,
    });
    console.log('[models/init_script.js] sequelize sync success');
    process.exit(0);
}).catch(function (err) {
    console.error('[models/init_script.js] sequelize sync fail');
    console.error(err);
    process.exit(1);
});