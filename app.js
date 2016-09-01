var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/tiny');     //链接数据库

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({extended:true})); // 解析表单提交的数据
app.use(bodyParser.json()); // 解析json数据格式
app.use(express.static(path.join(__dirname, 'public')));      //添加静态文件（css，js等）的路径
app.locals.moment = require('moment');
app.listen(port);
console.log('service star on ' + port);
//app.set('port',port);

app.get('/',function(req, res){
   Movie.fetch(function(err, movies) {
      console.log(movies)
      if(err){
         console.log(err)
      }
      res.render('index',{
         title: 'Tiny首页',
         movies: movies
      }) ;
   });
});

app.get('/movie/:id',function(req, res){
   var id = req.params.id;
   Movie.findById(id, function(err, movie) {
      if(err){
         console.log(err)
      }
      res.render('detail',{
         title: 'Tiny' + movie.title,
         movie: movie
      }) ;
   });
});

app.get('/admin/movie',function(req, res){
   res.render('admin',{
      title:'Tiny后台录入页',
      movie:{
         title:'',
         doctor:'',
         country: '',
         language: '',
         year: '',
         poster: '',
         summary: '',
         flash: ''
      }
   }) ;
});

//admin update movie
app.get('/admin/update/:id', function(req, res) {
   var id = req.params.id;
   if(id) {
      Movie.findById(id, function (err, movie) {
         if (err) {
            console.log(err);
         }
         res.render('admin', {
            title: 'Tiny 后台更新页',
            movie: movie
         })
      })
   }
});

// admin post movie
app.post('/admin/movie/new', function(req, res) {
   var id = req.body.movie._id;
   var movieObj = req.body.movie;
   var _movie;
   if(id !== 'undefined') {
      Movie.findById(id, function(err, movie) {
         if(err) {
            console.log(err);
         }
         _movie = _.extend(movie. movieObj)
         _movie.save(function(err, movie) {
            if(err) {
               console.log(err);
            }
            res.redirect('/movie/' + movie._id);
         })
      })
   } else {
      _movie = new Movie({
         doctor: movieObj.doctor,
         title: movieObj.title,
         country: movieObj.country,
         language: movieObj.language,
         year: movieObj.year,
         poster: movieObj.poster,
         summary: movieObj.summary,
         flash: movieObj.flash
      });
      _movie.save(function(err, movie) {
         if(err) {
            console.log(err);
         }
         res.redirect('/movie/' + movie._id);
      })
   }
});

app.get('/admin/list',function(req, res){
   Movie.fetch(function(err, movies) {
      if(err){
         console.log(err)
      }
      res.render('list',{
         title:'Tiny列表页',
         movies:movies
      }) ;
   });

});