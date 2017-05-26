/*
 * 用户的数据库的结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//视频的表结构
module.exports = new mongoose.Schema ({
     videoName:  String,
	 videoPath:  String,
     imagePath: String,
     category:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'VideoCategory'//引用另一张表
     }
})
