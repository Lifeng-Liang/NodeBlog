var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var article = require('./routes/article');

var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/article', article);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
 
  var Engine = require('tingodb')(), assert = require('assert');
  var db = new Engine.Db('db', {});
  var db_users = db.collection("users");
  var db_article = db.collection("articles");
  var db_misc = db.collection("misc");
  db_users.count(function(err, count){
    if(count <= 0){
      db_users.insert([{name: "tom", password: "123"}], {w:1}, function(err, user){
        var fs = require('fs');
        fs.readFile('./README.md', 'utf-8', function(err, data) {
          db_article.insert([
            {title: "welcome", summary: "welome to the real world!", content: data, format: 'markdown', cid: 0, uid: user._id, read: 0, comments: []},
            {title: "Hello", summary: "Hello from the blog.", content: "<p>hello, is there anyone there?</p>", format: 'html', cid: 0, uid: user._id, read: 0, comments: []}
          ]);
        });
        db_misc.insert({name: 'article', categories: [
          {name: "文章", alias: "essay", index: 0},
          {name: "作品", alias: "product", index: 1},
          {name: "转载", alias: "reshipment", index: 2}]});
        db_misc.insert({name: 'links',
          categories: [{name: "其它站点", list: []}, {name: "友情链接", list:[]}]});
      });
    }
  });
};

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
