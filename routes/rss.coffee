express = require('express')
router = express.Router()

### GET home page. ###

router.get '/', (req, res, next) ->
  res.redirect '/article/list'
  return
router.get '/test', (req, res, next) ->
  res.send 'Hello World ahaha'
  return
module.exports = router
