/*
 * 插件的模型类
 */
var mongoose = require('mongoose');
//引入对应schemas的表结构
var plugSchema = require('../schemas/plug');
//创建模型
module.exports = mongoose.model('plug',plugSchema);
