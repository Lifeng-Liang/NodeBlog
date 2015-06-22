var Engine = require('tingodb')(), assert = require('assert');
var dbe = new Engine.Db('db', {});
var db = {
  users: dbe.collection('users'),
  articles: dbe.collection('articles'),
  comments: dbe.collection('comments'),
  misc: dbe.collection('misc')
};

module.exports = db;