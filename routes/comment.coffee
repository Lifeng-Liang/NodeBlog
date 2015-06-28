express = require('express')
router = express.Router()
router.post '/create/:id', (req, res, next) ->
  req.models.article.get req.params.id, (err, article) ->
    writer = req.body['comment[writer]']
    content = req.body['comment[content]']
    if writer == null or writer == ''
      console.log 'writer name can not be empty'
      res.redirect '/article/show/' + req.params.id
    else if content == null or content == ''
      console.log 'content can not be empty'
      res.redirect '/article/show/' + req.params.id
    else
      req.models.comment.create {
        'article_id': article.id
        'writer': writer
        'content': content
        saved_on: new Date
      }, (err, result) ->
        if err
          throw err
        article.comments_count++
        article.save (err) ->
          if err
            throw err
          res.redirect '/article/show/' + req.params.id
          return
        return
    return
  return
router.get '/list/:page_no', (req, res, next) ->
  res.send 'Hello World ahaha'
  return
router.get '/destroy/:id', (req, res, next) ->
  req.models.comment.get req.params.id, (err, comment) ->
    if err
      throw err
    comment.remove (err) ->
      if err
        throw err
      res.redirect '/article/show/' + comment.article_id
      return
    return
  return
module.exports = router
