express = require('express')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
routes = require('./routes/index')
users = require('./routes/users')
article = require('./routes/article')
comment = require('./routes/comment')
rss = require('./routes/rss')
category = require('./routes/category')
hbs = require('hbs')
hbs.registerPartials __dirname + '/views/partials'
app = express()
# view engine setup
app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'hbs'
# uncomment after placing your favicon in /public
#app.use(favicon(__dirname + '/public/favicon.ico'));
app.use logger('dev')
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: false)
app.use cookieParser()
app.use express.static(path.join(__dirname, 'public'))
# initialize database.
require('./db') app
app.use '/', routes
app.use '/users', users
app.use '/article', article
app.use '/comment', comment
app.use '/rss', rss
app.use '/category', category
# catch 404 and forward to error handler
app.use (req, res, next) ->
  err = new Error('Not Found')
  err.status = 404
  next err
  return
# error handlers
# development error handler
# will print stacktrace
if app.get('env') == 'development'
  app.use (err, req, res, next) ->
    res.status err.status or 500
    res.render 'error',
      message: err.message
      error: err
    return
# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->
  res.status err.status or 500
  res.render 'error',
    message: err.message
    error: {}
  return
module.exports = app
