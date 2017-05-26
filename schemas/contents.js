/*
 * 文章内容的表的结构
 *
 * category  文章所属分类的id
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//分类的表结构
module.exports = new mongoose.Schema ({
	//关联字段
	 category:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Category'//引用另一张表
	 },
	 title:  String,
	 description: {
		 type: String,
		 default:''//默认值
	 },
	 content: {
		 type: String,
		 default:''//默认值
	 },
	//评论的内容,应该是数组格式
	 comments:{
	 	type:Array,
		default:[]
	 },
	//浏览量
	 views:{
		 type:Number,
		 default:0
	 },
	 startTime: {
		 type:Date,
		 default:new Date()
	 }
})
