express = require('express')
router = express.Router()
md = require('markdown').markdown
categories = require('../categories')

render_list = (page_no, req, res) ->
  req.models.article.find({}).limit(10).order('-id').run (err, list) ->
    res.render 'article/list',
      title: '列表:'
      'list': list
      'page_no': page_no
      'categories': categories

router.get '/list', (req, res, next) ->
  render_list 0, req, res

router.get '/list/:page_no', (req, res, next) ->
  render_list req.params.page_no, req, res

render_article = (req, res, article) ->
  article.save { views_count: article.views_count+1 }, (err) ->
    if err
      throw err
  if article.format == 'markdown'
    article.content = md.toHTML(article.content)
  req.models.user.get article.user_id, (err, user) ->
    if err
      throw err
    req.models.comment.find { 'article_id': article.id }, (err, comments) ->
      if err
        throw err
      res.render 'article/show',
        title: '文章'
        'article': article
        'user': user
        'comments': comments
        'categories': categories

router.get '/show/:id', (req, res, next) ->
  req.models.article.one {alias:req.params.id}, (err, article) ->
    if err
      throw err
    if article
      render_article req, res, article
    else
      req.models.article.get req.params.id, (err, article) ->
        render_article req, res, article

router.get '/new', (req, res, next) ->
  res.render 'article/new', 'categories': categories

router.post '/create', (req, res, next) ->
  a = clone req.body
  a.views_count = 0
  a.comments_count = 0
  a.created_on = new Date
  a.user_id = 1
  req.models.article.create [a], (err, result) ->
    if err
      throw err
    res.redirect '/article/list'

router.get '/edit/:id', (req, res, next) ->
  req.models.article.get req.params.id, (err, article) ->
    if err
      throw err
    res.render 'article/edit',
      'article': article
      'categories': categories

router.post '/update/:id', (req, res, next) ->
  req.models.article.get req.params.id, (err, article) ->
    if err
      throw err
    article.save clone(req.body), (err) ->
      res.redirect '/article/list'

clone = (src) ->
  dest = {}
  for k,v of src
    dest[k] = v
  return dest

module.exports = router
