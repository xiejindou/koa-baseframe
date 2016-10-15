"use strict";

var bunyan = require('bunyan');
const utils = require('./');
const IS_IN_PRODUCTION = utils.isProduction();

var logger = bunyan.createLogger({name: "myapp"});

logger.getLogger = function(option) {
  if (typeof option === 'string') {
    option = {scope: option};
  }
  return logger.child(option);
};

module.exports = logger;
