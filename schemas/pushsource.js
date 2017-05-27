/*
 * js静态资源的数据库结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//分类的表结构
module.exports = new mongoose.Schema ({
	 name:  String,//文件名称
	 url: String,//资源的链接
	 startTime: Number//资源创建的时间
})
