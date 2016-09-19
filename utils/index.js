"use strict";

var crypto = require('crypto');

module.exports = {
  md5: function (text) {
    return crypto.createHash('md5').update(text).digest('hex');
  },
  isEmail: function (str) {
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(str);
  },
  isPhoneNumber: function (str) {
    return /^1\d{10}$/gi.test(str);
  },
  hbs: require('./hbs'),
  //logger: require('./logger'),
  isProduction: () => {
    return process.env.NODE_ENV === 'production';
  }
};