"use strict";

const bytes = require('bytes');
const utils = require('../libs/utils');
const logger = require('../libs/logger');
const createError = require('http-errors');
const uuid = require('uuid');

module.exports = {
  requestLogger: function* (next) {
    let start = new Date().getTime();
    yield next;
    let duration = (new Date().getTime()) - start;
    let len = this.length;
    let length;
    // get the human readable response length
    if (~[204, 205, 304].indexOf(this.status)) {
      length = '';
    } else if (null == len) {
      length = '-';
    } else {
      length = bytes(len);
    }

    logger.info(`${this.method} ${this.url} ${this.status} ${duration}ms ${length}`);
  },
  errorHandler: function* (next) {
      /**
       * {errorName: err.name, stack: err.stack, error: err}
       */
    try {
      yield next;
    } catch (err) {
      if (err.status && err.status < 500) {
        logger.warn(err.stack || err);
      } else {
        logger.error(err.stack || err);
      }

      if (err.status) {
        if (!this.headerSent) {
          this.status = err.status || 500;
          let message = this.status >= 500 ? 'Internal Server Error' : err.message;
          let errorBody = {code: this.status, message: message || 'error'};
          this.body = errorBody;
        }
      } else {
        // not an error, it's a yhsd error
        if (!this.headerSent) {
          this.status = (err && err.code) || 500;
          let errorBody = {code: this.status, message: 'Internal Server Error'};
          if (!utils.isProduction()) {
            errorBody.message = (err && err.message) || errorBody.message;
          }
          this.body = errorBody;
        }
      }
    }
  },
  requestUuid: function* (next) {
      this.req_id = uuid.v1();
      yield next
  }
};
