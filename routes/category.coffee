express = require('express')
router = express.Router()
categories = require('../categories')

router.get '/', (req, res, next) ->
  req.send 'ahaha'

find_one = (list, cb) ->
  for item in list
    if cb(item)
      return item

render_catgory = (article, res, name, page_no) ->
  category = find_one(categories, (item) => item.alias == name)
  article.find('category_id': category.id).limit(10).order('-id').run (err, list) ->
    if err
      throw err
    res.render 'category/list',
      'categories': categories
      title: '列表:'
      'list': list
      'page_no': page_no
      'category': category

router.get '/:name', (req, res, next) ->
  render_catgory(req.models.article, res, req.params.name, 0)

router.get '/:name/:page_no', (req, res, next) ->
  render_catgory(req.models.article, res, req.params.name, req.params.page_no)

module.exports = router
