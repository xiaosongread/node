/*
 * 一级的数据库的结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//资源分类的表结构
module.exports = new mongoose.Schema ({
     sourceParentName:  String,
     id: Number,
     icon: String,
     parentId: {//默认主菜单
        type: Number,
        default: 0
     },
     startTime: Number
})
