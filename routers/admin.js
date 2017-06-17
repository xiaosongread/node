//加载express模块
var express = require('express');
var router = express.Router();//创建路由
var User = require('../models/users');
var Category = require('../models/category');
var wechatusers = require('../models/wechatusers');
var Content = require('../models/contents');
var VideoCategory = require('../models/videoCategory');
var VideoList = require('../models/videoList');
var Source = require('../models/source');
var Pushsource = require('../models/pushsource');
var Banner = require('../models/banner');
var Plug = require('../models/plug');
var fs = require('fs');
var formidable = require("formidable");
var bodyParser = require('body-parser');
var path = require('path');
var multipart = require('multipart');
var Minizip = require('node-minizip');

/*
 *  用户分类
 *  的相关逻辑
 */
//验证一下进入的是否是管理员
router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		res.send('对不起,只有管理员才能进入后台管理')
	}
	next();
})
//管理后台首页的路由
router.get('/',function(req,res,next){
	res.render('admin/index',{
		userInfo:req.userInfo
	});
})
//用户管理的路由
router.get('/user',function(req,res,next){
	/*
	 * 从数据库中读取数据列表,将数据分配给列表模板
	 * limit(number) : 限制获取的数据的条数
	 * skip() : 忽略数据的条数
	 *
	 * 每页显示2条
	 * 1.1-2 skip:0
	 * 2.3-4 skip:2
	 */
	var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
	var limte = 10;

	var pages = 0;
	//查询数据库中的数据的条数
	User.count().then(function(count){
		pages = Math.ceil(count / limte);//客户端应该显示的总页数
		page = Math.min(page,pages);//page取值不能超过pages
		page = Math.max(page,1);//page取值不能小于1
		var skip = (page - 1) * limte;
		User.find().limit(limte).skip(skip).then(function(users){
			// console.log(users)
			res.render('admin/user_index',{
				userInfo:req.userInfo,
				users:users,
				page:page,
				count:count,
				pages:pages,
				limte:limte
			});
		})
	})
})
//用户管理的路由
router.get('/wechaUser',function(req,res,next){
	/*
	 * 从数据库中读取数据列表,将数据分配给列表模板
	 * limit(number) : 限制获取的数据的条数
	 * skip() : 忽略数据的条数
	 *
	 * 每页显示2条
	 * 1.1-2 skip:0
	 * 2.3-4 skip:2
	 */
    var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
    var limte = 10;

    var pages = 0;
    //查询数据库中的数据的条数
    wechatusers.count().then(function(count){
        pages = Math.ceil(count / limte);//客户端应该显示的总页数
        page = Math.min(page,pages);//page取值不能超过pages
        page = Math.max(page,1);//page取值不能小于1
        var skip = (page - 1) * limte;
        wechatusers.find().limit(limte).skip(skip).then(function(users){
            // console.log(users)
            res.render('admin/userList_wechat',{
                userInfo:req.userInfo,
                users:users,
                page:page,
                count:count,
                pages:pages,
                limte:limte
            });
        })
    })
})
/*
 *  文章分类
 *  的相关逻辑
 */
//分类管理的路由
router.get('/category',function(req,res,next){
	var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
	var limte = 10;
	var pages = 0;
	//查询数据库中的数据的条数
	Category.count().then(function(count){
		pages = Math.ceil(count / limte);//客户端应该显示的总页数
		page = Math.min(page,pages);//page取值不能超过pages
		page = Math.max(page,1);//page取值不能小于1
		var skip = (page - 1) * limte;
		//sort()排序  -1 降序 1 升序
		Category.find().sort({_id: -1}).limit(limte).skip(skip).then(function(categorys){
			res.render('admin/category_index',{
				userInfo:req.userInfo,
				categorys:categorys,
				page:page,
				count:count,
				pages:pages,
				limte:limte
			});
		})
	})
})
//分类添加的路由 显示页面
router.get('/category/add',function(req,res,next){
	res.render('admin/category_add',{
		userInfo:req.userInfo
	})
})
//分类的保存 保存数据
router.post('/category/add',function(req,res,next){
	var name = req.body.name || '';
	var sort = req.body.sort || '';
	if(name == ''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMessage:"分类名称不能为空!"
		});
	}
	//验证分类名是否在数据库中存在,如果存在,就提示已存在
	Category.findOne({
		name:name
	}).then(function(name){//数据库中有这条数据
		//name为null的时候,说明数据库里面没有这条数据
		if(name){
			res.render('admin/error',{
				userInfo:req.userInfo,
				errorMessage:"此分类名称已经存在!"
			});
			return Promise.reject();//Promise.reject(reason)方法返回一个用reason拒绝的Promise。es6的语法
		}else{//没有这条数据就保存到数据库中
			//保存分类名称到数据库
			var category = new Category({
				name:req.body.name,
				sort:req.body.sort,
				startTime:Date.parse(new Date())
			})
			return category.save();
		}
	}).then(function(newCategory){
		res.render('admin/success',{
			userInfo:req.userInfo,
			successMessage:"分类名称保存成功!",
			url:"/admin/category"
		})
	})
})
//分类名称编辑的路由
router.get('/category/edit',function(req,res,next){
	//获取到要修改的数据,并用表单的形式展现出来
	var id = req.query.id || "";
	Category.findOne({
		_id:id
	}).then(function(categoryInfo){
		if(!categoryInfo){//表示没有这条数据
			res.render('admin/error',{
				userInfo:req.userInfo,
				errorMessage:"没有这条数据!"
			})
			return Promise.reject();
		}else{
			res.render('admin/category_edit',{
				userInfo:req.userInfo,
				categoryInfo:categoryInfo
			})
		}
	})
})
//分类名称页面编辑的路由
router.post('/category/edit',function(req,res,next){
	var name = req.body.name || '';//客户端传过来的name(分类名称);
	var id = req.query.id || "";//当前要修改的分类名称的id;
	if(name == ""){//表示客户端传过来的是空值
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMessage:"修改分类名称不能为空!"
		});
		return Promise.reject();
	}else{
		//查找当前修改的数据在数据库中的信息
		Category.findOne({
			_id:id
		}).then(function(categoryInfo){
			if(categoryInfo.name == name){//表示这条客户端数据没有做修改
				res.render('admin/error',{
					userInfo:req.userInfo,
					errorMessage:"分类名称并没有做修改!"
				})
				return Promise.reject();
			}
			//验证修改后的分类名称在数据中存在吗,存在的话返回给客户端
			Category.findOne({
				name:name
			}).then(function(isHave){
				if(isHave){//修改后的分类名称在数据库中存在了
					res.render('admin/error',{
						userInfo:req.userInfo,
						errorMessage:"修改后的分类名称已存在!"
					})
					return Promise.reject();
				}else{
					//将修改后的数据保存替换掉当前数据中的数据;
					return Category.update({
						//修改的值
						_id:id
					},{
						//更新的值
						name:name
					})
				}
			}).then(function(err,result){
				res.render('admin/success',{
					userInfo:req.userInfo,
					successMessage:"分类名称修改成功!",
					url:"/admin/category"
				})
			})
		})
	}
})
//分类名称删除的路由
router.get('/category/delete',function(req,res,next){
	var id = req.query.id || "";
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){//数据库中没有当前这条数据
			res.render('admin/error',{
				userInfo:req.userInfo,
				errorMessage:"没有要删除的这条数据"
			})
			return Promise.reject();
		}else{
			//删除当前的数据
			return Category.remove({
				_id:id
			})
		}
	}).then(function(isDelete){
		res.render('admin/success',{
			userInfo:req.userInfo,
			successMessage:"分类名称修改成功!",
			url:"/admin/category"
		})
	})
})
/*
 *  文章的
 *  相关逻辑
 */
//文章列表首页的路由
router.get('/content',function(req,res,next) {
	var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
	var limte = 10;
	var pages = 0;
	//查询数据库中的数据的条数
	Content.count().then(function(count) {
		pages = Math.ceil(count / limte);//客户端应该显示的总页数
		page = Math.min(page, pages);//page取值不能超过pages
		page = Math.max(page, 1);//page取值不能小于1
		var skip = (page - 1) * limte;
		//sort()排序  -1 降序 1 升序
		//populate('category')  填充关联内容的字段的具体内容(关联字段在指定另一张表中的具体内容)
		Content.find().sort({_id: -1}).limit(limte).skip(skip).populate('category').then(function (contents) {
			res.render('admin/content_index', {
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
//文章内容添加的路由
router.get('/content/add',function(req,res,next) {
	Category.find().then(function(Categories){//获取到数据库中分类列表
		console.log(Categories)
		res.render('admin/content_add',{
			userInfo:req.userInfo,
			categories:Categories
		});
	})
})
//文章内容保存post的路由
router.post('/content/add',function(req,res,next) {
	var category = req.body.category; //文章的分类
	var title = req.body.title; //文章的标题
	var description = req.body.description; //文章的简介
	var contents = req.body.content; //文章的内容
	console.log("文章保存")
	console.log(category)
	if(!category){//表示没有这条数据
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMessage:"文章分类不能为空!"
		})
		return Promise.reject();
	}
	if(!title){//表示没有这条数据
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMessage:"文章标题不能为空!"
		})
		return Promise.reject();
	}
	if(!description){//表示没有这条数据
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMessage:"文章简介不能为空!"
		})
		return Promise.reject();
	}
	if(!contents){//表示没有这条数据
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMessage:"文章内容不能为空!"
		})
		return Promise.reject();
	}
	//保存文章内容到数据库
	console.log("GGGGGGGGGGGGGGGGGGGGGG")
	var content = new Content({
		category:category,
		title:title,
		description:description,
		content:contents
	});
	return content.save().then(function(contents){
		res.render('admin/success',{
			userInfo:req.userInfo,
			successMessage:"文章添加成功!",
			url:"/admin/content"
		})
	});
})
//文章编辑显示内容的的路由
router.get('/content/edit',function(req,res,next) {
	var id = req.query.id || "";//文章的id
	Content.findOne({
		_id:id
	}).then(function(contents){
		var categoryId = contents.category;
		Category.findOne({
			_id:categoryId
		}).then(function(categories){
			res.render('admin/content_edit',{
				userInfo:req.userInfo,
				contents:contents,
				categoriyName:categories.name,
				id:id
			});
		})
	})
})

//文章删除的路由
router.get('/content/delete',function(req,res,next) {
	var id = req.query.id || "";
	Content.findOne({
		_id:id
	}).then(function(content){
		if(!content){//数据库中没有当前这条数据
			res.render('admin/error',{
				userInfo:req.userInfo,
				errorMessage:"没有要删除的这篇文章"
			})
			return Promise.reject();
		}else{
			//删除当前的数据
			return Content.remove({
				_id:id
			})
		}
	}).then(function(isDelete){
		res.render('admin/success',{
			userInfo:req.userInfo,
			successMessage:"文章删除成功!",
			url:"/admin/content"
		})
	})
})
//视频分类添加路由
router.get('/videoCatoryAdd',function(req,res,next){
    res.render('admin/videoCategory_add',{
        userInfo:req.userInfo
    })
})
//视频分类接受保存
router.post('/videoCatoryAdd',function(req,res,next){
    var name = req.body.name || '';
    var id = req.body.id || '';
    var imagePath = req.body.imagePath || "";
    // console.log(typeof id)
    if(name == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            errorMessage:"视频分类名称不能为空!"
        });
    }
    //验证视频分类名是否在数据库中存在,如果存在,就提示已存在
    VideoCategory.findOne({
        name:name
    }).then(function(name){//数据库中有这条数据
        //name为null的时候,说明数据库里面没有这条数据
        if(name){
            res.render('admin/error',{
                userInfo:req.userInfo,
                errorMessage:"此分类名称已经存在!"
            });
            return Promise.reject();//Promise.reject(reason)方法返回一个用reason拒绝的Promise。es6的语法
        }else{//没有这条数据就保存到数据库中
            //保存分类名称到数据库
            var videoCategory = new VideoCategory({
                name:req.body.name,
                id:req.body.id,
                imagePath: imagePath,
                startTime:Date.parse(new Date())
            })
            return videoCategory.save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo:req.userInfo,
            successMessage:"分类名称保存成功!",
            url:"/admin/videoCatoryAdd"
        })
    })
})
//修改用户vip
router.get('/userVip',function(req,res,next){
    res.render('admin/userVip')
})
//修改vip接口
router.post('/userVip',function(req,res,next){
    var username = req.body.username || '';
    var vip = req.body.vip || '';
    if(username == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            errorMessage:"用户名不能为空!"
        });
    }
    User.update({
        //修改的值
        username:username
    },{
        //更新的值
        vip:vip
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo:req.userInfo,
            successMessage:"用户vip权限成功!",
            url:"/admin/user"
        })
    })
})
//添加视频路由
router.get('/videoAdd',function(req,res,next){
    VideoCategory.find().then(function(videoCategory){
    	// console.log(videoCategory)
        res.render('admin/videoAdd',{
            videoCategory:videoCategory
		})
	})
})
//添加视频路由
router.post('/videoAdd',function(req,res,next){
    var videoName = req.body.videoName || '';
    var videoPath = req.body.videoPath || '';
    var imagePath = req.body.imagePath || '';
    var category = req.body.category;
    //保存用户注册的账号到数据库中
    var videoList = new VideoList({
        videoName: videoName,
        videoPath:  videoPath,
        imagePath: imagePath,
        category: category
    });
    return videoList.save().then(function(videoList){
        res.render('admin/success',{
            userInfo:req.userInfo,
            successMessage:"添加视频成功!",
            url:"/admin/videoAdd"
        })
    });
})
//添加视频列表路由
router.get('/videoList',function(req,res,next){
    var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
    var limte = 10;
    var pages = 0;
    //查询数据库中的数据的条数
    VideoList.count().then(function(count) {
        pages = Math.ceil(count / limte);//客户端应该显示的总页数
        page = Math.min(page, pages);//page取值不能超过pages
        page = Math.max(page, 1);//page取值不能小于1
        var skip = (page - 1) * limte;
        //sort()排序  -1 降序 1 升序
        //populate('category')  填充关联内容的字段的具体内容(关联字段在指定另一张表中的具体内容)
        VideoList.find().sort({_id: -1}).limit(limte).skip(skip).populate('category').then(function (contents) {
            res.render('admin/videoList', {
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
//添加创建banner路由
router.get('/bannerAdd',function(req,res,next){
    res.render('admin/banner_add')
})
//添加banner提交路由
router.post('/bannerAdd',function(req,res,next){
    var imagePath = req.body.imagePath || '';
    var introduce = req.body.introduce || '';
    var bannerhref = req.body.bannerhref || '';
    // console.log(imagePath,introduce,bannerhref)
    //保存用户注册的账号到数据库中
    var banner = new Banner({
        imagePath:  imagePath,
        introduce:  introduce,
        bannerhref: bannerhref
    });
    return banner.save().then(function(bannerList){
        res.render('admin/success',{
            userInfo:req.userInfo,
            successMessage:"添加banner成功!",
            url:"/admin/bannerAdd"
        })
    });
})
//添加banner列表路由
router.get('/bannerList',function(req,res,next){
    var page = Number(req.query.page || 1);//req.query.page 获取?后面的页数
    var limte = 10;
    var pages = 0;
    //查询数据库中的数据的条数
    Banner.count().then(function(count) {
        pages = Math.ceil(count / limte);//客户端应该显示的总页数
        page = Math.min(page, pages);//page取值不能超过pages
        page = Math.max(page, 1);//page取值不能小于1
        var skip = (page - 1) * limte;
        //sort()排序  -1 降序 1 升序
        //populate('category')  填充关联内容的字段的具体内容(关联字段在指定另一张表中的具体内容)
        Banner.find().sort({_id: -1}).limit(limte).skip(skip).then(function (bannerLists) {
            res.render('admin/banner_list', {
                userInfo: req.userInfo,
                bannerLists: bannerLists,
                page: page,
                count: count,
                pages: pages,
                limte: limte
            });
        })
    })
})
//banner删除的路由
router.get('/bannerList/delete',function(req,res,next) {
    var id = req.query.id || "";
    Banner.findOne({
        _id:id
    }).then(function(content){
        if(!content){//数据库中没有当前这条数据
            res.render('admin/error',{
                userInfo:req.userInfo,
                errorMessage:"没有要删除的这个banner"
            })
            return Promise.reject();
        }else{
            //删除当前的数据
            return Banner.remove({
                _id:id
            })
        }
    }).then(function(isDelete){
        res.render('admin/success',{
            userInfo:req.userInfo,
            successMessage:"banner删除成功!",
            url:"/admin/bannerList"
        })
    })
})

//创建一级资源分类页面
router.get('/addSourceCategoryParent',function(req,res,next){
    res.render('admin/sourceCategoryParent_add')
})
//创建一级资源分类路由
router.post('/addSourceCategoryParent',function(req,res,next){
    var sourceParentName = req.body.sourceParentName || '';
    var icon = req.body.icon || '';
    var id = 0;
    Source.find().sort({_id: 1}).then(function(sourceList){
    	console.log(sourceList)
		if(!sourceList.length){
            id ++;
		}else{
            id = sourceList[sourceList.length - 1].id + 1
		}
        //保存注册的账号到数据库中
        var source = new Source({
            sourceParentName:  sourceParentName,
            id: id,
            icon: icon,
            startTime: Date.parse(new Date())
        });
        return source.save().then(function(sourceData){
            res.render('admin/success',{
                userInfo:req.userInfo,
                successMessage:"一级资源添加成功!",
                url:"/admin/addSourceCategoryParent"
            })
        });
	})

})
//创建2️⃣级资源分类页面
router.get('/addSourceCategoryChild',function(req,res,next){
    Source.find({
        parentId: 0
	}).then(function(categories){
        res.render('admin/sourceCategoryChild_add',{
            categories: categories,
            userInfo:req.userInfo,
		})
	})
})
//创建二级资源分类路由
router.post('/addSourceCategoryChild',function(req,res,next){
    var sourceParentName = req.body.sourceParentName || '';
    var parentId = req.body.parentId;
    var icon = req.body.icon || '';
    var id = 0;
    Source.find({
        parentId:{$gt:0}
    }).sort({_id: 1}).then(function(sourceList){
        console.log(sourceList)
        if(!sourceList.length){
            id ++;
        }else{
            id = sourceList[sourceList.length - 1].id + 1
        }
        //保存注册的账号到数据库中
        var source = new Source({
            sourceParentName:  sourceParentName,
            id: id,
            icon: icon,
            parentId : parentId,
            startTime: Date.parse(new Date())
        });
        return source.save().then(function(sourceData){
            res.render('admin/success',{
                userInfo:req.userInfo,
                successMessage:"二级资源添加成功!",
                url:"/admin/addSourceCategoryChild"
            })
        });
    })

})
//资源上传页面路由
router.get('/push',function(req,res,next){
    res.render('admin/push')
})
//保存静态资源的数据
router.post('/push',function(req,res,next){
    var url = req.body.url || '';
    var name = req.body.name || '';
    //保存注册的账号到数据库中
    var pushsource = new Pushsource({
        url:  url,
        name:  name,
        startTime: Date.parse(new Date())
    });
    return pushsource.save().then(function(pushsourceData){
        res.render('admin/success',{
            userInfo:req.userInfo,
            successMessage:"js资源添加成功!",
            url:"/admin/push"
        })
    });
})

//zip资源上传页面路由
router.get('/addResources',function(req,res,next){
    Source.find({
        parentId: {$gt: 0}
    }).then(function(childCategory){
        Source.find().then(function(sourceCategories) {
            var parentCategory = [];
            sourceCategories.forEach(function (value, index) {
                if (value.parentId == 0) {
                    parentCategory.push(value);
                }
            })
            res.render('admin/addResources',{
                userInfo:req.userInfo,
                parentCategory:parentCategory,//一级分类
                childCategory:childCategory//二级分类
            })
        })
	})
})
//zip资源上传保存路由
router.post('/addResources',function(req,res,next){
    var name = req.body.name || '';
	var imgurl = req.body.imgurl;
	var categoryParentId = req.body.categoryParentId;
    var categoryChildId = req.body.categoryChildId;
    var introduce = req.body.introduce;//插件简介
    var downUrl = req.body.downUrl;//资源的下载链接
    var lookUrl = req.body.lookUrl;//资源的查看地址
	var id = 0;
    Plug.find().sort({_id: 1}).then(function(plugList) {
        console.log(plugList)
        if (!plugList.length) {
            id++;
        } else {
            id = plugList[plugList.length - 1].id + 1
        }
        //保存注册的账号到数据库中
        var plug = new Plug({
            id:id,//自定义的Id
            name: name,//插件名称
            imgurl: imgurl,//插件的封面图片
            categoryParentId:categoryParentId,
            categoryChildId:categoryChildId,
            introduce: introduce,//插件简介
            downUrl: downUrl,//资源的下载链接
            lookUrl: lookUrl,//资源的查看地址
            startTime: Date.parse(new Date())
        });
        return plug.save().then(function(plugData){
            console.log("保存成功2")
            res.render('admin/success',{
                userInfo:req.userInfo,
                successMessage:"zip插件添加成功!",
                url:"/admin/addResources"
            })
        });
    })
})

//上传图片
router.post('/apply/upload',function(req,res,next){
    var cacheFolder = './public/images/uploadcache/';
    var currentUser = req.userInfo.username;
    var userDirPath =cacheFolder+ currentUser;
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;
    var displayUrl;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        var extName = ''; //后缀名
        console.log(files.upload.type)
        switch (files.upload.type) {
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length === 0) {
            res.send({
                code: 202,
                msg: '只支持png和jpg格式图片'
            });
            return;
        } else {
            var avatarName = '/' + Date.now() + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            displayUrl = currentUser;
            fs.renameSync(files.upload.path, newPath); //重命名
            newPath = newPath.substring(1);
            res.send({
                code: 200,
                msg: displayUrl,
                url: "https://"+ req.host + newPath
            });
        }
    });
})


//上传js静态资源
router.post('/apply/push',function(req,res,next){
    var cacheFolder = './public/source/js/';
    var currentUser = req.userInfo.username;
    var userDirPath =cacheFolder+ currentUser;
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;
    var displayUrl;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        var extName = ''; //后缀名
        console.log(files.upload.type)
        switch (files.upload.type) {
            case 'text/javascript':
                extName = 'js';
                break;
        }
        if (extName.length === 0) {
            res.send({
                code: 202,
                msg: '只支持js静态资源上传'
            });
            return;
        } else {
            var avatarName = '/' + Date.now() + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            displayUrl = currentUser;
            fs.renameSync(files.upload.path, newPath); //重命名
            newPath = newPath.substring(1);
            res.send({
                code: 200,
                msg: displayUrl,
                url: "https://"+ req.host + newPath
            });
        }
    });
})



//上传插件资源
router.post('/apply/addZip',function(req,res,next){
	console.log(res)
    var cacheFolder = './public/source/zip/';
    var currentUser = req.userInfo.username;
    var userDirPath =cacheFolder+ currentUser;
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;
    var displayUrl;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        var extName = ''; //后缀名
        switch (files.upload.type) {
            case 'application/zip':
                extName = 'zip';
                break;
        }
        if (extName.length === 0) {
            res.send({
                code: 202,
                msg: '只支持zip资源上传'
            });
            return;
        } else {
            var avatarName = '/' + Date.now() + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            displayUrl = currentUser;
            fs.renameSync(files.upload.path, newPath); //重命名
			var jyName = avatarName.substring(1,avatarName.length - 4);//解压后的文件名字
            newPath = newPath.substring(2);
            var path = userDirPath.substring(2) + '/';
            console.log(userDirPath)
            Minizip.unzip(newPath, path + jyName, function(err) {
                if (err){
                    console.log(err);
                }else{
                    console.log('unzip successfully.');
                }
            });
            res.send({
                code: 200,
                msg: displayUrl,
                url: "https://"+ req.host + '/' + newPath,
                lookUrl: "https://"+ req.host + '/' + path + jyName + '/'
            });
        }
    });
})
module.exports = router;