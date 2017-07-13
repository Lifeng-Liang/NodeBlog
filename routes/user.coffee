express = require('express')
router = express.Router()
categories = require('../categories')

### GET users listing. ###

router.get '/register', (req, res, next) ->
  res.render 'user/register',
    categories: categories

router.get '/login', (req, res, next) ->
  res.render 'user/login',
    categories: categories

router.get '/logout', (req, res, next) ->
  res.render 'user/logout',
    categories: categories

module.exports = router
