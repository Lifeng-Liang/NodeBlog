var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/article/list');
});

router.get('/test', function(req, res, next) {
  res.send('Hello World ahaha');
});

module.exports = router;

