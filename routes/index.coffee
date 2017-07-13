express = require('express')
router = express.Router()

### GET home page. ###

router.get '/', (req, res, next) ->
  res.redirect '/article/list'

router.get '/test', (req, res, next) ->
  res.send 'Hello World ahaha'

module.exports = router
