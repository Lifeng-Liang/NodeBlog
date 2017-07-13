express = require('express')
router = express.Router()
orm = require('orm')
categories = require('../categories')

### GET search listing. ###

router.post '/article', (req, res, next) ->
  q = req.body['q']
  kw = q?.trim()
  if kw.length > 0
    req.models.article.find({title:orm.like('%'+q+'%')}).limit(10).order('-id').run (err, list) ->
      if err
        throw err
      res.render 'search/article',
        list: list
        key_word: q
        categories: categories
  else
    res.redirect '/article/list'

module.exports = router
