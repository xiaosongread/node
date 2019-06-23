# node-前端资源库版本
网站迁移后

## 准备条件
+ 安装node+npm环境
+ 安装本地mongodb 数据库

## use
```javascript
npm install //安装对应的依赖
node app1.js // 启动服务
```
> 文件中的20190513-mongdbbak.zip博客数据，恢复博客数据。
  1.压缩此压缩包
  2.启动mongodb，mongod --dbpath=/Users/songyanbin/Desktop/node/db
  2.执行mongorestore -d data --dir 数据的目录的绝对路径(此路径为压缩文件之后的目录文件)(r比如：/Users/songyanbin/Desktop/mongdbbak/data/)

> 运行此项目，恢复数据这块可以不执行，默认就是没有数据。

输入 http://localhost:8008/resources，效果如下：

![blockchain](https://raw.githubusercontent.com/xiaosongread/node/master/img-folder/node-1.png)
![blockchain](https://raw.githubusercontent.com/xiaosongread/node/master/img-folder/node-2.png)
