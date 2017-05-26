//加载express模块
var express = require('express');
var router = express.Router();//创建路由
var User = require('../models/users');
var Category = require('../models/category');
var Content = require('../models/contents');
var Comments = require('../models/comment');
router.get('/',function(req,res,next){
	var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
	var limte = 10;
	var pages = 0;
//	res.send('shouye')
	//从数据库中获取网站的分类名称
	Category.find().then(function(categories){
		//查询数据库中的数据的条数
		Content.count().then(function(count) {
			pages = Math.ceil(count / limte);//客户端应该显示的总页数
			page = Math.min(page, pages);//page取值不能超过pages
			page = Math.max(page, 1);//page取值不能小于1
			var skip = (page - 1) * limte;
			//sort()排序  -1 降序 1 升序
			//populate('category')  填充关联内容的字段的具体内容(关联字段在指定另一张表中的具体内容)
			Content.find().sort({_id: -1}).limit(limte).skip(skip).populate('category').then(function (contents) {
				res.render('main/index.html', {
					categories:categories,
					userInfo: req.userInfo,
					contents: contents,
					page: page,
					count: count,
					pages: pages,
					limte: limte
				});
			})
		})
	})
})
//评论列表的路由
router.get('/contentInfo',function(req,res,next){
	var id = req.query.id || "";//当前点击的文章的ID
	Category.find().then(function(categories){
		Content.findById({
			_id:id
		}).populate('category').then(function(content){
			content.views++;
			content.save();
			//获取文章对应的评论,按文章的id查询
			Comments.find({
				contentId:id
			}).then(function(comments){
				res.render('main/contentInfo', {
					categories:categories,
					userInfo: req.userInfo,
					content:content,
					comments:comments
				});
			})
		})
	})
})
//导航列表点击进入对应的分类下面的文章列表
router.get('/categoryList_index',function(req,res,next){
	var id = req.query.id || "";//当前点击的分类的ID
	var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
	var limte = 10;
	var pages = 0;
//	res.send('shouye')
	//从数据库中获取网站的分类名称
	Category.find().then(function(categories){
		//查询数据库中的数据的条数
		Content.find(
			{category:id}//分类的ID
		).count().then(function(count) {
			pages = Math.ceil(count / limte);//客户端应该显示的总页数
			page = Math.min(page, pages);//page取值不能超过pages
			page = Math.max(page, 1);//page取值不能小于1
			var skip = (page - 1) * limte;
			//sort()排序  -1 降序 1 升序
			//populate('category')  填充关联内容的字段的具体内容(关联字段在指定另一张表中的具体内容)
			Content.find(
				{category:id}//分类的ID
				).sort({_id: -1}).limit(limte).skip(skip).populate('category').then(function (contents) {
				res.render('main/categoryList_index.html', {
					categories:categories,
					userInfo: req.userInfo,
					contents: contents,
					page: page,
					count: count,
					pages: pages,
					limte: limte,
					id:id
				});
			})
		})
	})
})
//导航栏关于我的路由
router.get('/aboutMe',function(req,res,next){
	res.render('main/aboutMe_index.html')
})
//搜索页面
router.get('/search',function(req,res,next){
	var keyWord = req.query.keyWord;
	var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
	var limte = 10;
	var pages = 0;
	if(!keyWord){
		responseData.code = 404;
		responseData.message = '关键字不能为空';
		res.json(responseData);
		return;
	}
	Category.find().then(function(categories){
		//查询数据库中的数据的条数
		Content.find(
			{"title": {$regex: keyWord, $options:'i'}}
		).count().then(function(count) {
			pages = Math.ceil(count / limte);//客户端应该显示的总页数
			page = Math.min(page, pages);//page取值不能超过pages
			page = Math.max(page, 1);//page取值不能小于1
			var skip = (page - 1) * limte;
			//sort()排序  -1 降序 1 升序
			//populate('category')  填充关联内容的字段的具体内容(关联字段在指定另一张表中的具体内容)
			Content.find(
				{"title": {$regex: keyWord, $options:'i'}}
			).sort({_id: -1}).limit(limte).skip(skip).populate('category').then(function (contents) {
				res.render('main/search.html', {
					categories:categories,
					userInfo: req.userInfo,
					contents: contents,
					page: page,
					count: count,
					pages: pages,
					limte: limte
				});
			})
		})
	})
})
module.exports = router;