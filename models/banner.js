/*
 * user的模型类
 */
var mongoose = require('mongoose');
//引入对应schemas的表结构
var bannerSchema = require('../schemas/banner');
//创建模型
module.exports = mongoose.model('banner',bannerSchema);
