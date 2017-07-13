express = require('express')
router = express.Router()
RSS = require('rss')
categories = require('../categories')
config = require('../config')

### GET home page. ###

router.get '/', (req, res, next) ->
  res.redirect '/article/list'

router.get '/article', (req, res, next) ->
  req.models.article.find({}).limit(10).order('-id').run (err, list) ->
    if err
      throw err
    feed = new RSS {
      title:      'MyBlog'
      description:'My Blog'
      site_url:   config.site
      feed_url:   config.site + '/rss/article'
      language:   'zh-CN'
      pubDate:    new Date
      ttl:        60
    }
    for o in list
      link = config.site + '/article/show/' + o.id
      feed.item {
        title:        '['+categories[o.category_id-1].name+'] '+o.title
        description:  o.summary
        url:          link
        guid:         link
        author:       o.writer
        date:         o.created_on
      }
    res.send feed.xml({indent: true})

router.get '/comment', (req, res, next) ->
  req.models.comment.find({}).limit(10).order('-id').run (err, list) ->
    if err
      throw err
    feed = new RSS {
      title:      'MyBlog comments'
      description:'My Blog Comments'
      site_url:   config.site
      feed_url:   config.site + '/rss/comment'
      language:   'zh-CN'
      pubDate:    new Date
      ttl:        60
    }
    for o in list
      link = config.site + '/article/show/' + o.article_id
      feed.item {
        title:        o.article_title
        description:  o.content
        url:          link
        guid:         link + '#c' + o.id
        author:       o.writer
        date:         o.saved_on
      }
    res.send feed.xml({indent: true})

module.exports = router
