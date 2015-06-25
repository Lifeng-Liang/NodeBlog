var express = require('express');
var router = express.Router();

var categories = require('../categories');

router.get('/', function(req, res, next) {
  req.send("ahaha");
});

router.get('/:name/:page_no', function(req, res, next) {
  var category = categories.reduce(function(item) {if(item.alias == req.params.name) return item;});
	req.models.article.find({'category_id': category.id}).limit(10).order('-id').run(function(err, list) {
    if(err) throw err;
    res.render('category/list', {'categories': categories, title: '列表:', 'list': list, 'page_no': req.params.page_no, 'category': category});
  });
});

module.exports = router;

