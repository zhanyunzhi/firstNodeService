var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc');     //链接数据库

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({extended:false})); // 解析表单提交的数据
app.use(bodyParser.json()); // 解析json数据格式
app.use(express.static(path.join(__dirname, 'public')));      //添加静态文件（css，js等）的路径
app.locals.moment = require('moment');
app.listen(port);
console.log('service star on ' + port);
//app.set('port',port);

app.get('/',function(req, res){
   res.render('index',{
      title:'Tiny首页',
      movies:[{
         _id:1,
         poster:''
      }]
   }) ;
});

app.get('/movie/:id',function(req, res){
   res.render('detail',{
      title:'Tiny详情页'
   }) ;
});

app.get('/admin/movie',function(req, res){
   res.render('admin',{
      title:'Tiny后台录入页',
      movie:{
         title:'',
         doctor:''
      }
   }) ;
});

app.get('/admin/list',function(req, res){
   res.render('list',{
      title:'Tiny列表页',
      movies:[{
         _id:1,
         title:''
      }]
   }) ;
});