express = require('express')
router = express.Router()
categories = require('../categories')
router.get '/', (req, res, next) ->
  req.send 'ahaha'
  return
router.get '/:name/:page_no', (req, res, next) ->
  category = categories.reduce((item) ->
    if item.alias == req.params.name
      return item
    return
  )
  req.models.article.find('category_id': category.id).limit(10).order('-id').run (err, list) ->
    if err
      throw err
    res.render 'category/list',
      'categories': categories
      title: '列表:'
      'list': list
      'page_no': req.params.page_no
      'category': category
    return
  return
module.exports = router
