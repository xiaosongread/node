//加载express模块
var express = require('express');
var router = express.Router();//创建路由
var User = require('../models/users');
var Category = require('../models/category');
var Content = require('../models/contents');
var Comments = require('../models/comment');
var VideoList = require('../models/videoList');
var VideoCategory = require('../models/videoCategory');
var Pushsource = require('../models/pushsource');
var Source = require('../models/source');
var Plug = require('../models/plug');
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
                var deviceAgent = req.headers["user-agent"].toLowerCase();
                var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
                if(agentID){
                    res.render('webApp/index.html')
                }else{
                    res.render('main/index.html', {
                        categories:categories,
                        userInfo: req.userInfo,
                        contents: contents,
                        page: page,
                        count: count,
                        pages: pages,
                        limte: limte
                    });
                }

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
			}).populate('userId').then(function(comments){
                var deviceAgent = req.headers["user-agent"].toLowerCase();
                var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
                if(agentID){
                    res.render('webApp/contentInfo.html')
                }else{
                    res.render('main/contentInfo', {
                        categories:categories,
                        userInfo: req.userInfo,
                        content:content,
                        comments:comments
                    });
                }
			})
		})
	})
})
//导航列表点击进入对应的分类下面的文章列表
router.get('/categoryList_index',function(req,res,next){
	var id = req.query.id || "";//当前点击的分类的ID
	var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
	var limte = 12;
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
                var deviceAgent = req.headers["user-agent"].toLowerCase();
                var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
                if(agentID){
                    res.render('webApp/categoryList_index.html')
                }else{
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
                }
			})
		})
	})
})
//视频列表页面路由
router.get('/videoList',function(req,res,next){
    VideoList.find().then(function(videoList) {
        Category.find().then(function(categories) {
            VideoCategory.find().then(function (videoCategory) {
                // console.log(videoCategory)
                res.render('main/videoList.html', {
                    userInfo: req.userInfo,
                    videoCategory: videoCategory,
                    videoList: videoList,
                    categories:categories
                })
            })
        })
    })
})
//视频f分类列表页面路由
router.get('/videoListCategory',function(req,res,next){
    var id = req.query.id || "";
    VideoList.find(
		{category:id}
	).populate('category').then(function(videoList) {
        Category.find().then(function(categories) {
            VideoCategory.find().then(function (videoCategory) {
                res.render('main/videoListCategory.html', {
                    userInfo: req.userInfo,
                    videoCategory: videoCategory,
                    videoList: videoList,
                    categories:categories
                })
            })
        })
    })
})
//视频详情页面路由
router.get('/videoInfo',function(req,res,next){
	var id = req.query.id || "";
	VideoList.find(
		{_id:id}//分类的ID
	).then(function(videoList) {
		Category.find().then(function(categories) {
			VideoCategory.find().then(function (videoCategory) {
				res.render('main/videoInfo.html', {
					userInfo: req.userInfo,
					videoCategory: videoCategory,
					videoList: videoList,
					categories:categories
				})
			})
		})
	})
})
//导航栏关于我的路由
router.get('/null',function(req,res,next){
	res.render('main/null.html')
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
//vip页面路由
router.get('/vip',function(req,res,next){
	Category.find().then(function(categories) {
			res.render('main/vip.html', {
				userInfo: req.userInfo,
				categories:categories
			})
	})
})
//静态资源路由
router.get('/jssource',function(req,res,next){
    Pushsource.find().then(function(source) {
        res.render('main/jsSource.html', {
            userInfo: req.userInfo,
            source:source
        })
    })
})
//JQ路由
router.get('/jquery1.8.3.html',function(req,res,next){
    Pushsource.find().then(function(source) {
        res.render('main/jquery1.8.3.html', {
            userInfo: req.userInfo,
            source:source
        })
    })
})

// resource路由
// 首页页面路由
router.get('/resources',function(req,res,next){
    var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
    var limte = 12;
    var pages = 0;
//	res.send('shouye')
    //从数据库中获取网站的分类名称
    Category.find().then(function(categories){
        //查询数据库中的数据的条数
        Plug.count().then(function(count) {
            pages = Math.ceil(count / limte);//客户端应该显示的总页数
            page = Math.min(page, pages);//page取值不能超过pages
            page = Math.max(page, 1);//page取值不能小于1
            var skip = (page - 1) * limte;
            //sort()排序  -1 降序 1 升序
            //populate('category')  填充关联内容的字段的具体内容(关联字段在指定另一张表中的具体内容)
            Plug.find().sort({_id: -1}).limit(limte).skip(skip).populate('categoryParentId').populate('categoryChildId').then(function (recourcePlug) {
            	console.log(recourcePlug)
				res.render('resources/index', {
					categories:categories,
					userInfo: req.userInfo,
                    recourcePlug: recourcePlug,
					page: page,
					count: count,
					pages: pages,
					limte: limte
				});
            })
        })
    })
})
// 资源详情页面
router.get('/resources/info',function(req,res,next){
	console.log("进入插件详情")
    var id = req.query.id || "";//当前点击的文章的ID
    Category.find().then(function(categories){
    	console.log("1")
        Plug.findById({
            _id:id
        }).populate('categoryParentId').populate('categoryChildId').then(function(plugInfo){
			console.log(plugInfo)
            plugInfo.views++;
            plugInfo.save();
			res.render('resources/resourcesInfo.html', {
				categories:categories,
				userInfo: req.userInfo,
                plugInfo:plugInfo
			});
        })
    })
})
//插件分类列表页面路由
router.get('/resources/categoryList',function(req,res,next){
	var id = req.query.id;
	console.log(id)
    var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
    var limte = 12;
    var pages = 0;
    Category.find().then(function(categories) {
        Pushsource.find().then(function (source) {
            Plug.find({
                categoryChildId:id
			}).count().then(function(count) {
			    console.log(count)
                pages = Math.ceil(count / limte);//客户端应该显示的总页数
                page = Math.min(page, pages);//page取值不能超过pages
                page = Math.max(page, 1);//page取值不能小于1
                var skip = (page - 1) * limte;
                Plug.find({
                    categoryChildId:id
				}).sort({_id: -1}).limit(limte).skip(skip).populate('categoryParentId').populate('categoryChildId').then(function (recourcePlug) {
                    res.render('resources/recourceCategoryList', {
                        categories:categories,
                        userInfo: req.userInfo,
                        recourcePlug: recourcePlug,
                        source: source,
                        page: page,
                        count: count,
                        pages: pages,
                        limte: limte
                    });
                })
            })
        })
    })
})

//登陆页面路由
router.get('/login',function(req,res,next){
    console.log(req.userInfo)
    Category.find().then(function(categories) {
        res.render('main/login.html', {
            userInfo: req.userInfo,
            categories:categories
        })
    })
})

module.exports = router;