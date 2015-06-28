express = require('express')
router = express.Router()
md = require('markdown').markdown
categories = require('../categories')

render_list = (page_no, req, res) ->
  req.models.article.find({}).limit(10).order('-id').run (err, list) ->
    console.log page_no
    res.render 'article/list',
      title: '列表:'
      'list': list
      'page_no': page_no
      'categories': categories
    return
  return

router.get '/list', (req, res, next) ->
  render_list 0, req, res
  return
router.get '/list/:page_no', (req, res, next) ->
  render_list req.params.page_no, req, res
  return
router.get '/show/:id', (req, res, next) ->
  req.models.article.get req.params.id, (err, article) ->
    if article.format == 'markdown'
      article.content = md.toHTML(article.content)
    req.models.user.get article.user_id, (err, user) ->
      req.models.comment.find { 'article_id': article.id }, (err, comments) ->
        res.render 'article/show',
          title: '文章'
          'article': article
          'user': user
          'comments': comments
          'categories': categories
        return
      return
    return
  return
router.get '/new', (req, res, next) ->
  res.render 'article/new', 'categories': categories
  return
router.post '/create', (req, res, next) ->
  req.models.article.create [ {
    title: req.body['article[title]']
    summary: req.body['article[summary]']
    content: req.body['article[content]']
    format: req.body['article[format]']
    views_count: 0
    comments_count: 0
    created_on: new Date
    category_id: Number(req.body['article[category]'])
    user_id: 1
  } ], (err, result) ->
    res.redirect '/article/list'
    return
  return
router.get '/edit/:id', (req, res, next) ->
  req.models.article.get req.params.id, (err, article) ->
    res.render 'article/edit',
      'article': article
      'categories': categories
    return
  return
router.post '/update/:id', (req, res, next) ->
  req.models.article.get req.params.id, (err, article) ->
    if err
      throw err
    article.save {
      title: req.body['article[title]']
      summary: req.body['article[summary]']
      content: req.body['article[content]']
      format: req.body['article[format]']
      cid: Number(req.body['article[category]'])
    }, (err) ->
      res.redirect '/article/list'
      return
    return
  return
module.exports = router
