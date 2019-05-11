var express = require('express');
var path = require('path');
var createError = require('http-errors');
//var bodyParser = require('body-parser');
var app = express();
 
//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public/img/usersAvatar')));
app.use(express.static(path.join(__dirname, 'asset/blogImg')));
app.use(express.static(path.join(__dirname, 'asset/columnTopImg')));
app.use(express.static(path.join(__dirname, 'asset/columnarticlePicture')))

 
//允许跨域
app.all('*',function(req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-headers","Origin, X-Requested-With, Content-Type, Content-Length,Authorization,token,cache,Accept,yourHeaderFeild");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Methods","Authorization")
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type","application/json;charset=utf-8");
    next();
    });


const user = require('./routes/user');
const blog = require('./routes/blog')
const comment = require('./routes/comment');
const reply = require('./routes/reply')
const column = require('./routes/column');
const articleComment = require('./routes/articleComment');
const articleReply = require('./routes/articleReply');
const upload_OR_delete_picture = require('./routes/upload_OR_delete_picture')
const activelink = require('./routes/activelink')

 

app.use('/user',user)
app.use('/blog',blog)
app.use('/comment',comment)
app.use('/reply',reply);
app.use('/column',column)
app.use('/articleComment',articleComment)
app.use('/articleReply',articleReply)
app.use('/uploadordeletepicture',upload_OR_delete_picture)
app.use('/activelink',activelink)

// 试用 jwt 

 


    // catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
