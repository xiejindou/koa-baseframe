"use strict";

const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');
const join = path.resolve;
const readdir = fs.readdirSync;

module.exports = function(app,root) {
  readdir(root).forEach(function(file) {
    let dir = join(root,file);
    //logger.debug(dir);
    let stats = fs.lstatSync(dir);
    if(stats.isFile()) {
      let conf = require(dir);
      if (typeof conf.routes === 'function') {
        app.use(conf.routes());
        // app.use('/'+file.slice(0,-3),conf.routes());
        logger.debug('load routes: ' + file);
      }
    }
  })
  logger.debug('Finish loading routes.');
};