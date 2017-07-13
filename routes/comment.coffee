express = require('express')
categories = require('../categories')
router = express.Router()

router.post '/create/:id', (req, res, next) ->
  req.models.article.get req.params.id, (err, article) ->
    writer = req.body['comment[writer]']
    content = req.body['comment[content]']
    if writer == null or writer == ''
      console.log 'writer name can not be empty'
      res.redirect '/article/show/' + article.id
    else if content == null or content == ''
      console.log 'content can not be empty'
      res.redirect '/article/show/' + article.id
    else
      req.models.comment.create {
        'article_id': article.id
        'article_title': article.title
        'writer': writer
        'content': content
        'saved_on': new Date
      }, (err, result) ->
        if err
          throw err
        article.save {comments_count: article.comments_count+1}, (err) ->
          if err
            throw err
        res.redirect '/article/show/' + article.id

render_comments = (req, res, page_no) ->
  req.models.comment.find().limit(10).order('-id').run (err, list) ->
    if err
      throw err
    res.render 'comment/list',
      'list': list
      'page_no': page_no
      'categories': categories

router.get '/list', (req, res, next) ->
  render_comments(req, res, 0)

router.get '/list/:page_no', (req, res, next) ->
  render_comments(req, res, res.params.page_no)

router.get '/destroy/:id', (req, res, next) ->
  req.models.comment.get req.params.id, (err, comment) ->
    if err
      throw err
    req.models.article.get comment.article_id, (err, article) ->
      if err
        throw err
      article.save {comments_count: article.comments_count-1}
    comment.remove (err) ->
      if err
        throw err
      res.redirect '/article/show/' + comment.article_id

module.exports = router
