/*
 * 一级分类的模型类
 */
var mongoose = require('mongoose');
//引入对应schemas的表结构
var sourceSchema = require('../schemas/source');
//创建模型
module.exports = mongoose.model('Source',sourceSchema);
