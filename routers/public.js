//加载express模块
var express = require('express');
var router = express.Router();//创建路由
var User = require('../models/users');
var Category = require('../models/category');
var Content = require('../models/contents');
var bodyParser = require('body-parser');
var ueditor = require('ueditor-nodejs');
var path = require('path');
//使用模块
router.get("/ueditor/ue", function (req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
        var imgname = req.ueditor.filename;
        var img_url = '/images/ueditorImg/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditorImg/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('nodejs/config.json');
    }
});
function dynamicFun(req){
    var dir = "public";
    switch (req.query.action) {
        case 'config':
            break;
        case 'uploadimage':
            dir += "/images/ueditorImg";
            break;
        case 'listimage':
            dir += "/images/ueditorImg";
            break;
        case 'uploadscrawl':
            dir += "/scrawl";
            break;
        case 'uploadfile':
            dir += "/file";
            break;
        case 'uploadvideo':
            dir += "/video";
            break;
        case 'listfile':
            dir += "/file";
            break;
    }
    return dir;
}

router.post('/ueditor/ue', ueditor({//这里的/ueditor/ue是因为文件件重命名为了ueditor,如果没改名，那么应该是/ueditor版本号/ue
    configFile: '/ueditor/nodejs/config.json',//如果下载的是jsp的，就填写/ueditor/jsp/config.json
    mode: 'local', //本地存储填写local
    accessKey: '',//本地存储不填写，bcs填写
    secrectKey: '',//本地存储不填写，bcs填写
    staticPath: "", //一般固定的写法，静态资源的目录，如果是bcs，可以不填
    dynamicPath:dynamicFun //动态目录，以/开头，bcs填写buckect名字，开头没有/.路径可以根据req动态变化，可以是一个函数，function(req) { return '/xx'} req.query.action是请求的行为，uploadimage表示上传图片，具体查看config.json.
}));
module.exports = router;