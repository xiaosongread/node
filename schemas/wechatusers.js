/*
 * 用户的数据库的结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//用户的表结构
module.exports = new mongoose.Schema ({
	 username:  String,
     header: String,
     openid: String,
     isAdmin:{
	     type:Boolean,
         default:false
     }
})
