/*  应用程序的启动（入口文件）*/
//加载express模块
var express = require('express');
//加载数据库模块,记录登陆状态
var mongoose = require('mongoose');
//加载cookies模块
var Cookies = require('cookies');
var path = require('path');
//引入用户user模型
var User = require('./models/users');
//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');
//通过express创建app应用 => nodejs Http.createServer();
var app = express();
//加载模板处理模块
var swig = require('swig');
// var pm2 = require('pm2');
//设置静态文件的托管
//用户请求的url，如果是以public开头的，他就会去public下面找对应请求的文件
app.use('/public',express.static(__dirname + "/public"));
// app.use('/ueditor',express.static(__dirname + "/ueditor"));
//在开发过程中需要取消模板的缓存
swig.setDefaults({cache:false});
//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数是模板引擎的名字，同时也是模板文件的后缀
//第二个参数是用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录,第一个参数必须是views,第二个参数是存放文件的路径
app.set('views','./views');
//注册模板引擎 第一个参数必须是view engine ，第二个参数是app.engine 定义的模板的名字
app.set('view engine','html');
//bodyParser的设置
app.use(bodyParser.urlencoded({extended:true}));
//cookies的设置
app.use(function(req,res,next){
	req.cookies = new Cookies(req,res);
	//获取到客户端header头里面的cookie的信息(req.cookies.get('userInfo');
	//设置一个全局的变量
	req.userInfo = {};
	if(req.cookies.get('userInfo')){
		try {
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
			//获取当前用户的类型,是否为管理员
			User.findById(req.userInfo._id).then(function(userInfo){
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                req.userInfo.vip = Boolean(userInfo.vip);
				next();
			})
		}catch (e){
			req.userInfo = {};
			next();
		}
	}else{
		next();
	}

});
/*
 * 根据不同的功能划分模块
 *
 */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
app.use('/public',require('./routers/public'));
app.use('/static',require('./routers/public'));
/*
 * node 自动打开指定的页面
 */
// var child_process = require("child_process"),
//     url = "http://localhost:8080";
//
// if(process.platform == 'wind32'){
//
//     cmd  = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
//
// }else if(process.platform == 'linux'){
//
//     cmd  = 'xdg-open';
//
// }else if(process.platform == 'darwin'){
//
//     cmd  = 'open';
//
// }
//连接数据库
mongoose.connect('mongodb://101.200.59.189:27017/data',function(err){
	if(err){
		console.log("数据库连接失败");
	}else{
		console.log("数据库连接成功");
        console.log("please open localhost:8080")
        // child_process.exec(cmd + ' "'+url + '"');
        //监听http请求
		app.listen(81);
	}
});
