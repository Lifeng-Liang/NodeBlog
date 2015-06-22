var express = require('express');
var router = express.Router();

var db = require('../db.js');

router.post('/create/:id', function(req, res, next) {
  db.articles.findOne({id: req.params.id}, function(err, article) {
    var writer = req.body["comment[writer]"];
    var content = req.body["comment[content]"];
    if(writer == null || writer == "") {
      console.log("writer name can not be empty");
      res.redirect('/article/show/' + req.params.id);
    } else if(content == null || content == "") {
      console.log("content can not be empty");
      res.redirect('/article/show/' + req.params.id);
    } else {
      db.misc.update({name: 'comment_id'}, {$inc: {value: 1}}, function (err, cid) {
        console.log("cid : >>>> " + cid);
        db.comments.insert({'id': cid, 'aid': article.id, 'writer': writer, 'content': content}, function(err, result) {
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
  db.articles.delete({id: req.params.id}, function(err, result) {
    res.redirect('/article/show/' + result.aid);
  });
});

module.exports = router;
