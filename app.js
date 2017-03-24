var express = require('express');
var router = express.Router();
var cors = require('cors');
var Query = require('./modules/queries.js');
var Codes = require('./modules/codes.js');
var multer = require('multer');
var path = require('path')
var schedule = require('node-schedule');
var child_process = require('child_process');
var bodyParser = require('body-parser');
var fs = require('fs-extra');
var app = express();

var codes = new Codes();
var queryy = new Query(codes);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
//app.user(bodyParser.json());
// after the code that uses bodyParser and other cool stuff
var originsWhitelist = [
  'http://localhost:4200',      //this is my front-end url for development
  ''
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
}
//here is the magic
app.use(cors(corsOptions));


var DIR = './uploads/';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      var ext = path.extname(file.originalname);
      var filename = file.originalname.replace(ext,'');
      filename = filename + Date.now() + ext;
      cb(null, filename);

        var params = {
          title: req.body.title,
          description: req.body.description,
          categoryid: req.body.category,
          firstTime: req.body.firstTime,
          access_token: req.body.access_token,
          fileName: filename,
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

app.post('/deletePost',cors(), function(req,res){
    var params = {
      access_token: req.body.access_token,
      id: req.body.id,
      postid: req.body.postid,
      filepath: req.body.path,
      filesystem: fs
    };

  queryy.verifyUserLogin(res,req,codes.POSTS_DELETE_FILE,params);
});


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



/** Create backup at 2:30 AM every night */
var j = schedule.scheduleJob({hour: 2, minute: 30}, function(){

  console.log("job ran at = "+Date.now());

  /** Create the postgres database script */
  child_process.exec('Z:/filesharing/sharing_backup.bat', function(error, stdout, stderr) {
  });

  var filesinUploads = [];
  var filesAlreadyBackedUp = [];


  filesAlreadyBackedUp = walkSync('Z:/filesharing/uploads');
  filesinUploads = walkSync('./uploads/');

  /** Files which are not in the backedUp folder */
  var intersection = [];

  /** If there are no files in the backup folder. Just copy all the files in ./uploads folder */
  if(filesAlreadyBackedUp.length == 0){
    for(var i = 0 ; i < filesinUploads.length; i++){
          copyFile(filesinUploads[i]);
    }    
  }
  else{
    /** If there are files in the backup folder. Only copy the ones which are new */
    for(var i = 0 ; i < filesinUploads.length; i++){
      for(var j = 0 ; j < filesAlreadyBackedUp.length; j++){

        if(filesinUploads[i] == filesAlreadyBackedUp[j]){
          break;
        }

        if(j == filesAlreadyBackedUp.length - 1){

          // we didn't break until this last iteration. Hence this file does not exist in the backup folder.
          copyFile(filesinUploads[i]);
        }
      }
    }
  }
  res.send('done');
});

var walkSync = function(dir) {
    files = fs.readdirSync(dir);
    filelist = [];
    files.forEach(function(file) {
        filelist.push(file);
    });
    return filelist;
};

var copyFile = function(filename) {
    fs.copy('./uploads/'+filename, 'Z:/filesharing/uploads/'+filename, err => {
      if (err) return console.error(err)
      console.log("success!")
    });
};

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});




