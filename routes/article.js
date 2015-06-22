var express = require('express');
var router = express.Router();

var db = require('../db.js');
var md = require( 'markdown' ).markdown;


router.get('/list', function(req, res, next) {
  render_list(0, res);
});

router.get('/list/:page_no', function(req, res, next) {
  render_list(req.params.page_no, res);
});

function render_list(page_no, res) {
  db.articles.find({},{limit:10, sort:["id",-1]}).toArray(function(err, list) {
    console.log(page_no);
    res.render('article/list', { title: '列表:', 'list': list, 'page_no': page_no });
  });
}

router.get('/show/:id', function(req, res, next) {
  db.articles.update({id: req.params.id}, {$inc: {read: 1}}, function(err, read){
    console.log("read : >> " + read);
    db.articles.findOne({id: req.params.id}, function(err, article) {
      if(article.format == 'markdown'){
        article.content = md.toHTML(article.content);
      }
      db.users.findOne({id: article.uid}, function(err, user) {
        db.comments.find({aid: article.id}).toArray(function(err, comments) {
          console.log(comments);
          res.render('article/show', {title: '文章', 'article': article, 'user': user, 'comments': comments});
        });
      })
    });
  });
});

router.get('/new', function(req, res, next) {
  db.misc.findOne({name: 'article'}, function(err, item) {
    res.render('article/new', {categories: item.categories});
  });
});

router.post('/create', function(req, res, next) {
  db.misc.update({name: 'article_id'}, {$inc: {value: 1}}, function(err, aid) {
    db.articles.insert([
      {
        id: aid,
        title: req.body['article[title]'],
        summary: req.body['article[summary]'],
        content: req.body['article[content]'],
        format: req.body['article[format]'],
        cid: Number(req.body['article[category]']),
        read: 0
      }], function(err, result) {
        res.redirect('/article/list');
      }
    );
  });
});

router.get('/edit/:id', function(req, res, next) {
  db.misc.findOne({name: 'article'}, function(err, item) {
    db.articles.findOne({id: req.params.id}, function(err, article) {
      res.render('article/edit', {'article': article, categories: item.categories});
    });
  });
});

router.post('/update/:id', function(req, res, next) {
  db.misc.findOne({name: 'article'}, function(err, item) {
    db.articles.update({id: req.params.id}, {$set: 
      {
        title: req.body['article[title]'],
        summary: req.body['article[summary]'],
        content: req.body['article[content]'],
        format: req.body['article[format]'],
        cid: Number(req.body['article[category]'])
      }}, function(err, result) {
        res.redirect('/article/list');
      });
  });
});

module.exports = router;

