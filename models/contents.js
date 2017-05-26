/*
 * user的模型类
 */
var mongoose = require('mongoose');
//引入对应schemas的表结构
var contentSchema = require('../schemas/contents');
//创建模型
module.exports = mongoose.model('Content',contentSchema);
