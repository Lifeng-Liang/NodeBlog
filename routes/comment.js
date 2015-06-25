var express = require('express');
var router = express.Router();


router.post('/create/:id', function(req, res, next) {
  req.models.article.get(req.params.id, function(err, article) {
    var writer = req.body["comment[writer]"];
    var content = req.body["comment[content]"];
    if(writer == null || writer == "") {
      console.log("writer name can not be empty");
      res.redirect('/article/show/' + req.params.id);
    } else if(content == null || content == "") {
      console.log("content can not be empty");
      res.redirect('/article/show/' + req.params.id);
    } else {
      req.models.comment.create({'article_id': article.id, 'writer': writer, 'content': content, saved_on: new Date()}, function(err, result) {
        if(err) throw err;
        article.comments_count++;
        article.save(function(err){
          if(err) throw err;
          res.redirect('/article/show/' + req.params.id);
        });
      });
    }
  });
});

router.get('/list/:page_no', function(req, res, next) {
  res.send('Hello World ahaha');
});

router.get('/destroy/:id', function(req, res, next) {
  req.models.comment.get(req.params.id, function(err, comment) {
    if(err) throw err;
    comment.remove(function(err) {
      if(err) throw err;
      res.redirect('/article/show/' + comment.article_id);
    });
  });
});

module.exports = router;
