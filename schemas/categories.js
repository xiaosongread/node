/*
 * 用户的数据库的结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//分类的表结构
module.exports = new mongoose.Schema ({
    //分类的名称
	 name:  String,
	 sort: Number,
	 startTime: Number
})
