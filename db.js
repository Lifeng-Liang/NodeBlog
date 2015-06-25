var orm = require('orm');

module.exports = function(app) {

  app.use(orm.express("sqlite://./db/blog.db", {
      define: function (db, models, next) {
        models.user = db.define("users", {
          email : String,
          password : String,
          show_name : String,
          role : ['admin', 'user'],
          created_on : Date,
          updated_on : Date,
          session_id : String
        });
        models.article = db.define("articles", {
          title : String,
          alias : String,
          content : String,
          summary : String,
          summary_is_empty : Boolean,
          recommend : Boolean,
          format : ['html', 'markdown'],
          writer : String,
          reference : String,
          views_count : {type: 'integer'},
          comments_count : {type: 'integer'},
          created_on : Date,
          user_id : {type: 'integer'},
          category_id : {type: 'integer'}
        });
        models.comment = db.define("comments", {
          writer : String,
          content : String,
          saved_on : Date,
          user_id : {type: 'integer'},
          article_id : {type: 'integer'}
        });
        // Initialize database
        db.sync(function(err) {
          if(err) throw err;
          init_db(models);
        });
        next();
      }
  }));

  function init_db(models) {
    models.user.count(function(err, count) {
      if(err) throw err;
      if(count <= 0) {
        models.user.create(
          {
            email: "tom",
            password: "123",
            show_name: "Tom",
            role: 'admin',
          }, function(err, user) {
            if(err) throw err;
            var fs = require('fs');
            fs.readFile('./README.md', 'utf-8', function(err, data) {
              models.article.create([
                {title: "welcome", summary: "welome to the real world!", content: data, format: 'markdown', views_count: 0, comments_count: 0, user_id: user.id, category_id: 1, created_on: new Date()},
                {title: "Hello", summary: "Hello from the blog.", content: "<p>hello, is there anyone there?</p>", format: 'html', views_count: 0, comments_count: 0, user_id: user.id, category_id: 1, created_on: new Date()}
              ], function(err, articles) {
                if(err) throw err;
                console.log(articles);
              });
            });
          }
        );
      }
    });
  };

};