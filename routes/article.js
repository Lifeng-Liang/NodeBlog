var express = require('express');
var router = express.Router();

var Engine = require('tingodb')(), assert = require('assert');
var db = new Engine.Db('db', {});
var db_article = db.collection('articles');
var db_misc = db.collection('misc');
var db_user = db.collection('users');

var md = require( 'markdown' ).markdown;


router.get('/list', function(req, res, next) {
  render_list(0, res);
});

router.get('/list/:page_no', function(req, res, next) {
  render_list(req.params.page_no, res);
});

function render_list(page_no, res) {
  db_article.find({},{limit:10, sort:["_id",-1]}).toArray(function(err, list) {
    console.log(page_no);
    res.render('article/list', { title: '列表:', 'list': list, 'page_no': page_no });
  });
}

router.get('/show/:id', function(req, res, next) {
  db_article.findOne({_id: req.params.id}, function(err, article){
    var r = article.read + 1;
    db_article.update({_id: req.params.id}, {$set: {read: r}});
    if(article.format == 'markdown'){
      article.content = md.toHTML(article.content);
    }
    db_user.findOne({_id: article.uid}, function(err, user) {
      res.render('article/show', {title: '文章', 'article': article, 'user': user});
    })
  });
});

router.get('/new', function(req, res, next) {
  db_misc.findOne({name: 'article'}, function(err, item) {
    res.render('article/new', {categories: item.categories});
  });
});

router.post('/create', function(req, res, next) {
  db_misc.findOne({name: 'article'}, function(err, item) {
    db_article.insert([
      {
        title: req.body['article[title]'],
        summary: req.body['article[summary]'],
        content: req.body['article[content]'],
        format: req.body['article[format]'],
        cid: Number(req.body['article[category]']),
        read: 0, comments: []},
      ], function(err, result) {
        res.redirect('/article/list');
      }
    );
  });
});

router.get('/edit/:id', function(req, res, next) {
  db_misc.findOne({name: 'article'}, function(err, item) {
    db_article.findOne({_id: req.params.id}, function(err, article) {
      res.render('article/edit', {'article': article, categories: item.categories});
    });
  });
});

router.post('/update/:id', function(req, res, next) {
  db_misc.findOne({name: 'article'}, function(err, item) {
    db_article.update({_id: req.params.id}, {$set: 
      {
        title: req.body['article[title]'],
        summary: req.body['article[summary]'],
        content: req.body['article[content]'],
        format: req.body['article[format]'],
        cid: Number(req.body['article[category]']),
        read: 0, comments: []
      }}, function(err, result) {
        res.redirect('/article/list');
      });
  });
});

module.exports = router;

