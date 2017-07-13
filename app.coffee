express = require('express')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
routes = require('./routes/index')
user = require('./routes/user')
article = require('./routes/article')
comment = require('./routes/comment')
rss = require('./routes/rss')
category = require('./routes/category')
search = require('./routes/search')
hbs = require('hbs')
dateFormat = require('dateformat')
categories = require('./categories')

hbs.registerHelper 'dateFormat', dateFormat
hbs.registerHelper 'isSelected', (f1, f2) -> if f1==f2 then 'selected=selected' else ''
hbs.registerHelper 'articleId', (id, alias) -> if alias?.length > 0 then alias else id
hbs.registerPartials __dirname + '/views/partials'
app = express()

# view engine setup
app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'hbs'

# uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use logger('dev')
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: false)
app.use cookieParser()
app.use express.static(path.join(__dirname, 'public'))

# initialize database.
require('./db') app
app.use '/', routes
app.use '/user', user
app.use '/article', article
app.use '/comment', comment
app.use '/rss', rss
app.use '/category', category
app.use '/search', search

# catch 404 and forward to error handler
app.use (req, res, next) ->
  err = new Error('Not Found')
  err.status = 404
  next err

# error handlers
# development error handler
# will print stacktrace
if app.get('env') == 'development'
  app.use (err, req, res, next) ->
    res.status err.status or 500
    res.render 'error',
      message: err.message
      error: err

# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->
  res.status err.status or 500
  res.render 'error',
    message: err.message
    error: {}

module.exports = app
