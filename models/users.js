/*
 * user的模型类
 */
var mongoose = require('mongoose');
//引入对应schemas的表结构
var usersSchema = require('../schemas/users');
//创建模型
module.exports = mongoose.model('User',usersSchema);
