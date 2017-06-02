/*
 * js静态资源的数据库结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//分类的表结构
module.exports = new mongoose.Schema ({
    name:  String,//插件名称
    imgurl: String,//插件的封面图片
    categoryParentId:{//插件的主分类ID
        type: mongoose.Schema.Types.ObjectId,
        ref:'Source'//引用另一张表
    },
    categoryChildId:{//插件的二级分类ID
        type: mongoose.Schema.Types.ObjectId,
        ref:'Source'//引用另一张表
    },
    introduce: String,//插件简介
	downUrl: String,//资源的下载链接
	lookUrl: String,//资源的查看地址
    views:{
        type:Number,
        default:0
    },
	startTime: Number//资源创建的时间
})
