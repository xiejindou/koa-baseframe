"use strict"
/**
 * 一些通用可复用逻辑
 */
const models = require('../models');
const path = require('path');
const uuid = require('uuid');
const utils = require('../libs/utils');
const fs = require('fs');
const config = require('../config');
const log = require('../libs/logger').tag('common');

/**
 * 保存二进制文件到本地，并且返回访问路径(相对)
 */
function saveFile(file) {
    let fileName = file.name;
    let fux = fileName.slice(fileName.indexOf('.'));
    let access_path = path.join('/res/imgs/', uuid.v1() + fux);
    let aimPath = path.join(utils.baseDir(), 'public', access_path);
    let rstream = fs.createReadStream(file.path);
    let wstream = fs.createWriteStream(aimPath);
    rstream.pipe(wstream);
    return access_path;
}

module.exports = {
    saveFile: saveFile
};