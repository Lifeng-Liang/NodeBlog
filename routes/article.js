var express = require('express');
var router = express.Router();

var md = require( 'markdown' ).markdown;
var categories = require('../categories');


router.get('/list', function(req, res, next) {
  render_list(0, req, res);
});

router.get('/list/:page_no', function(req, res, next) {
  render_list(req.params.page_no, req, res);
});

function render_list(page_no, req, res) {
  req.models.article.find({}).limit(10).order('-id').run(function(err, list) {
    console.log(page_no);
    res.render('article/list', { title: '列表:', 'list': list, 'page_no': page_no, 'categories': categories});
  });
}

router.get('/show/:id', function(req, res, next) {
  req.models.article.get(req.params.id, function(err, article) {
    if(article.format == 'markdown'){
      article.content = md.toHTML(article.content);
    }
    req.models.user.get(article.user_id, function(err, user) {
      req.models.comment.find({'article_id': article.id}, function(err, comments) {
        res.render('article/show', {title: '文章', 'article': article, 'user': user, 'comments': comments, 'categories': categories});
      });
    })
  });
});

router.get('/new', function(req, res, next) {
  res.render('article/new', {'categories': categories});
});

router.post('/create', function(req, res, next) {
  req.models.article.create([
    {
      title: req.body['article[title]'],
      summary: req.body['article[summary]'],
      content: req.body['article[content]'],
      format: req.body['article[format]'],
      views_count: 0,
      comments_count: 0,
      created_on: new Date(),
      category_id: Number(req.body['article[category]']),
      user_id: 1
    }], function(err, result) {
      res.redirect('/article/list');
    }
  );
});

router.get('/edit/:id', function(req, res, next) {
  req.models.article.get(req.params.id, function(err, article) {
    res.render('article/edit', {'article': article, 'categories': categories});
  });
});

router.post('/update/:id', function(req, res, next) {
  req.models.article.get(req.params.id, function(err, article) {
    if(err) throw err;
    article.save({
      title: req.body['article[title]'],
      summary: req.body['article[summary]'],
      content: req.body['article[content]'],
      format: req.body['article[format]'],
      cid: Number(req.body['article[category]'])
    }, function(err) {
      res.redirect('/article/list');
    });
  });
});

module.exports = router;

