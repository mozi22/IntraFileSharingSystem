var express = require('express');
var router = express.Router();
var cors = require('cors');
var fs = require('fs');
var Query = require('./modules/queries.js');
var Codes = require('./modules/codes.js');
var codes = new Codes();
var queryy = new Query(codes);
var multer = require('multer');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); res.setHeader('Access-Control-Allow-Methods', 'POST,GET');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
 
var DIR = './uploads/';
// var upload = multer({ dest: './uploads' }).any();
// app.use(upload,function(req,res,next){
  
// });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);

        var params = {
          title: req.body.title,
          description: req.body.description,
          categoryid: req.body.category,
          firstTime: req.body.firstTime,
          access_token: req.body.access_token,
          fileName: file.originalname,
          id: req.body.id
        };
      
        queryy.verifyUserLogin("",req,codes.POSTS_INSERT_NEW_DETAILS,params);
  }
})

var upload = multer({ storage: storage })

app.get('/uploadfile',cors(), function (req, res) {
  res.end('file catcher example');
});
 
app.post('/uploadfile',[upload.any(), function (req, res) {
      res.json({
          type: codes.RESPONSE_OK,
          message: 'success'
      });
}]);


app.get('/getusers',cors(),function(req,res){

        queryy.getAllUsers(res,req,codes.GET_ALL_USERS,"");
});
app.post('/updateuser',cors(),function(req,res){

    var params = {
      username: req.body.username,
      password: req.body.password,
      userid: req.body.userid,
      // access_token of super user
      access_token: req.body.access_token,

      // id of super user
      id: req.body.id
    }
  queryy.performOperation(res,req,codes.UPDATE_USER_DETAILS,params);
});


app.post('/login',cors(), function (req, res) {

  var params = {
    username: req.body.username,
    password: req.body.password
  };
  queryy.performOperation(res,req,codes.USER_LOGIN,params);
});

app.post('/signup',cors(), function (req, res) {

    var params = {
    username: req.body.username,
    password: req.body.password,
    credentials: req.body.credentials,

    // access_token of super user
    access_token: req.body.access_token,

    // id of super user
    id: req.body.id
  }
  //queryy.verifyUserLogin(res,req,codes.USER_START_SIGN_UP,params);

  queryy.verifyUserLogin(res,req,codes.USER_START_SIGN_UP,params);

});

/** This will bring the recent posts from all users */
app.get('/getposts',cors(),function(req,res){


  var params = {
    lastpostid: req.query.lastpostid,
    access_token: req.query.access_token,
    id: req.query.id
  }
  queryy.verifyUserLogin(res,req,codes.POSTS_GET_USER_DASHBOARD,params);
});


/** This will bring only a specific users post */
app.get('/userposts',cors(),function(req,res){



  var params = {
    lastpostid: req.query.lastpostid,
    access_token: req.query.access_token,
    postuserid: req.query.postuserid,
    id: req.query.id
  }
  queryy.verifyUserLogin(res,req,codes.POSTS_GET_USER_PERSONAL_DASHBOARD,params);
});


app.get('/categories',cors(),function(req,res){


 
  var params = {
    access_token: req.query.access_token,
    id: req.query.id
  }
  queryy.verifyUserLogin(res,req,codes.CATEGORIES_GET_ALL_CATEGORIES,params);
});


app.get('/downloadfile',cors(),function(req,res){

  var params = {
    access_token: req.query.access_token,
    id: req.query.id,
    filename: req.query.filename
  }
  queryy.verifyUserLogin(res,req,codes.POSTS_DOWNLOAD_FILE,params);

});


app.post('/updatecategory',cors(),function(req,res){


 
  var params = {
    access_token: req.body.access_token,
    id: req.body.id,
    catid: req.body.catid,
    categoryname: req.body.categoryname
  }
  queryy.verifyUserLogin(res,req,codes.CATEGORIES_UPDATE_CATEGORY,params);
});
app.post('/deletecategory',cors(),function(req,res){
  

  var params = {
    id: req.body.id,
    catid: req.body.catid,
    access_token: req.body.access_token
  }
  queryy.verifyUserLogin(res,req,codes.CATEGORIES_DELETE_CATEGORY,params);
});

app.post('/insertcategory',cors(),function(req,res){

  var params = {
    access_token: req.body.access_token,
    id: req.body.id,
    categoryname: req.body.categoryname
  }
  queryy.verifyUserLogin(res,req,codes.CATEGORIES_INSERT_CATEGORY,params);
  
});





app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});




