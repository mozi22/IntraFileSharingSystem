var promise = require('../node_modules/bluebird');
var md5 = require('../node_modules/md5');
var passwordHash = require('../node_modules/password-hash');



var Queries = function(codes){

    this.codes = codes;
    this.options = {
        // Initialization Options
        promiseLib: promise
    };


    this.POSTS_LIMIT = 51;

    this.cn = {
        host: 'localhost',
        port: 5432,
        database: 'sharing',
        user: 'postgres',
        password: 'root'
    };

    this.pgp = require('../node_modules/pg-promise')(this.options);
    this.db = this.pgp(this.cn);

}



Queries.prototype.verifyUserLogin = function(res, req, code, params) {
  var self = this;
  this.db.any('SELECT * FROM "Users" WHERE "Users"."id" = '+params.id+' AND "Users"."access_token"=\''+params.access_token+'\'')
    .then(function (data) {

    if(data.length > 0){
        self.performOperation(res,req, code, params);
    }
    else{
        res.json({
            type: self.codes.CODE_LOGOUT,
            message: 'User credentials wrong. logging out.',
            data: null
        });
    }
    })
    .catch(function (err) {
      return res.json(err);
    });
}


Queries.prototype.run = function(res,req,query){

    var self = this;
    this.db.any(query)
    .then(function (data) {
        res.json({
            type: self.codes.RESPONSE_OK,
            message: 'success',
            data: data
        });
    })
    .catch(function (err) {
      return res.json(err);
    });
}





Queries.prototype.performOperation = function(res, req, code, params) {
    if(code == this.codes.POSTS_GET_USER_DASHBOARD){
        this.getUserPosts(res,req,params);
    }
    else if(code == this.codes.POSTS_GET_USER_PERSONAL_DASHBOARD){
        this.getUserPersonalPosts(res,req,params);
    }
    else if(code == this.codes.CATEGORIES_GET_ALL_CATEGORIES){
        this.getCategories(res,req,params);
    }
    else if(code == this.codes.CATEGORIES_UPDATE_CATEGORY){
        this.updateCategory(res,req,params);
    }
    else if(code == this.codes.CATEGORIES_DELETE_CATEGORY){
        this.deleteCategory(res,req,params);
    }
    else if(code == this.codes.CATEGORIES_INSERT_CATEGORY){
        this.insertCategory(res,req,params);
    }
    else if(code == this.codes.POSTS_INSERT_NEW_DETAILS){
        this.insertNewPost(res,req,params);
    }
    else if(code == this.codes.USER_START_SIGN_UP){
        this.signUpUser(res,req,params);
    }
    else if(code == this.codes.USER_LOGIN){
        this.loginUser(res,req,params);
    }
    else if(code == this.codes.POSTS_DOWNLOAD_FILE){
        this.downloadFile(res,req,params);
    }
    else if(code == this.codes.GET_ALL_USERS){
        this.getAllUsers(res,req,params);
    }
    else if(code == this.codes.UPDATE_USER_DETAILS){
        this.updateUserDetails(res,req,params);
    }
}

Queries.prototype.updateUserDetails = function(res,req,params){
    if(params.password !== undefined){
        var encryptedPassword = passwordHash.generate(params.password);
        var query = 'UPDATE "Users" SET "username"=\''+params.username+'\', "password"=\''+encryptedPassword+'\' WHERE "id"='+params.userid;
    }
    else{
        var query = 'UPDATE "Users" SET "username"=\''+params.username+'\' WHERE "id"='+params.userid;
    }
    this.run(res,req,query);
}

Queries.prototype.getAllUsers = function(res,req,params){
    var query = 'SELECT "id","username" FROM "Users"';
    this.run(res,req,query);
}



Queries.prototype.downloadFile = function(res,req,params){
      res.download("./uploads/"+params.filename);
}
Queries.prototype.insertNewPost = function(res,req,params){

    if(params.firstTime == "true"){
        var query = 'INSERT INTO "UserUploads"("UserID","CategoryID","title","description") ' 
                           +'VALUES($1,$2,$3,$4) RETURNING id';
    }
    else{
        var query = 'SELECT id FROM "UserUploads" ORDER BY id DESC LIMIT 1';
    }
    var self = this;
    this.db.one(query,[params.id,params.categoryid,params.title,params.description]).then(function(data){

        self.db.one('INSERT INTO "UploadedFiles"("UserUploadsID","FilePath") VALUES($1,$2)',[data.id,params.fileName]).then(function(result){
            console.log(done);
        })
       .catch(error => {
            // if no data returned this will be called.
        });

    })
    .catch(error => {
        // if no data returned this will be called.
    });
}

Queries.prototype.insertCategory = function(res,req,params){
    var query = 'INSERT INTO "Categories"("category") VALUES(\''+params.categoryname+'\')';
    this.run(res,req,query);
}

Queries.prototype.deleteCategory = function(res,req,params){
    var query = 'DELETE FROM "Categories" WHERE "id"='+params.catid+'';
    this.run(res,req,query);
}
Queries.prototype.updateCategory = function(res,req,params){
    var query = 'UPDATE "Categories" SET "category"=\''+params.categoryname+'\' WHERE "id"='+params.catid+'';
    this.run(res,req,query);
}

Queries.prototype.getCategories = function(res,req,params){
    var query = 'SELECT categories."id", categories."category" as text FROM "Categories" categories';
    this.run(res,req,query);
}

Queries.prototype.getUserPersonalPosts = function(res,req,params){

    if(params.lastpostid!= -1){

                var upperlimit = params.lastpostid;
                var lowerlimit = params.lastpostid - this.POSTS_LIMIT;

                if(lowerlimit < 0){
                    lowerlimit = 0;
                }

                var query = 'SELECT category."id" as catid,uploads."id",category."category", '
                                +'users.id as userid,users.username,'
                                +'uploaded."FilePath", uploads."created_at",uploads."title",uploads."description" FROM "Categories" category '
                                +'INNER JOIN "UserUploads" uploads  ON category."id"=uploads."CategoryID" '
                                +'INNER JOIN "Users" users ON users."id" = uploads."UserID" '
                                +'INNER JOIN "UploadedFiles" uploaded ON uploaded."UserUploadsID"=uploads."id" '
                                +'WHERE uploads."UserID"='+params.postuserid+' AND uploads."id" < '+upperlimit+' AND uploads."id" > '+lowerlimit+''
                                +'ORDER BY uploads."id" DESC';

                this.run(res,req,query);
    }
    else{
        var self = this;
        this.db.any('SELECT "id" FROM "UserUploads" WHERE "UserID"='+params.postuserid+' ORDER BY "id" DESC LIMIT 1')
        .then(function (data) {
                
                var upperlimit = data[0].id;
                var lowerlimit = data[0].id - self.POSTS_LIMIT;
                if(lowerlimit < 0){
                    lowerlimit = 0;
                }

        var query = 'SELECT category."id" as catid,uploads."id",category."category", '
                            +'users.id as userid,users.username,'
                            +'uploaded."FilePath", uploads."created_at",uploads."title",uploads."description" FROM "Categories" category '
                            +'INNER JOIN "UserUploads" uploads  ON category.id=uploads."CategoryID" '
                            +'INNER JOIN "Users" users ON users."id" = uploads."UserID" '
                            +'INNER JOIN "UploadedFiles" uploaded ON uploaded."UserUploadsID"=uploads."id" '
                            +'WHERE uploads."UserID"='+params.postuserid+' AND uploads."id" <= '+upperlimit+' AND uploads."id" > '+lowerlimit+''
                            +'ORDER BY uploads."id" DESC';

                self.run(res,req,query);
        })
        .catch(function (err) {
        return res.json(err);
        });
    }

}




Queries.prototype.getUserPosts = function(res,req,params){


    if(params.lastpostid!= -1){

                var upperlimit = params.lastpostid;
                var lowerlimit = params.lastpostid - this.POSTS_LIMIT;

                if(lowerlimit < 0){
                    lowerlimit = 0;
                }

                var query = 'SELECT category."id" as catid,uploads."id",category."category", '
                                +'users.id as userid,users.username,'
                                +'uploaded."FilePath", uploads."created_at",uploads."title",uploads."description" FROM "Categories" category '
                                +'INNER JOIN "UserUploads" uploads  ON category."id"=uploads."CategoryID" '
                                +'INNER JOIN "Users" users ON users."id" = uploads."UserID" '
                                +'INNER JOIN "UploadedFiles" uploaded ON uploaded."UserUploadsID"=uploads."id" '
                                +'WHERE uploads."id" < '+upperlimit+' AND uploads."id" > '+lowerlimit+''
                                +'ORDER BY uploads."id" DESC';

                this.run(res,req,query);
    }
    else{
        var self = this;
        this.db.any('SELECT "id" FROM "UserUploads" ORDER BY "id" DESC LIMIT 1')
        .then(function (data) {
                
                var upperlimit = data[0].id;
                var lowerlimit = data[0].id - self.POSTS_LIMIT;
                if(lowerlimit < 0){
                    lowerlimit = 0;
                }

                    var query = 'SELECT category."id" as catid,uploads."id",category."category", '
                                        +'users.id as userid,users.username,'
                                        +'uploaded."FilePath", uploads."created_at",uploads."title",uploads."description" FROM "Categories" category '
                                        +'INNER JOIN "UserUploads" uploads  ON category."id"=uploads."CategoryID" '
                                        +'INNER JOIN "Users" users ON users."id" = uploads."UserID" '
                                        +'INNER JOIN "UploadedFiles" uploaded ON uploaded."UserUploadsID"=uploads."id" '
                                        +'WHERE uploads."id" <= '+upperlimit+' AND uploads."id" > '+lowerlimit+''
                                        +'ORDER BY uploads."id" desc';

                self.run(res,req,query);
        })
        .catch(function (err) {
        return res.json(err);
        });
    }
}


Queries.prototype.loginUser = function(res,req,params){
    var query = 'SELECT users.*,credentials."CredentialID" FROM "Users" users INNER JOIN "UserCredentials" credentials '
                         +'ON users."id"=credentials."UserID"  WHERE users."username" = \''+params.username+'\'';
    var self = this;

    this.db.any(query)
    .then(function (data) {
        if(data.length == 0){
            res.json({
                type: self.codes.RESPONSE_USER_NOT_FOUND,
                message: 'User not exists.'
            });
        }
        else{
            
            if(passwordHash.verify(params.password, data[0].password)){

                var date = Date.now();
                var access_token = md5(date+params.username);
                self.db.any('UPDATE "Users" SET "access_token"=\''+access_token+'\' WHERE id='+ data[0].id);

                data[0].access_token = access_token;
                delete data[0].password;

                res.json({
                    type: self.codes.RESPONSE_OK,
                    message: 'success',
                    data: data
                });
            }
            else{

                res.json({
                    type: self.codes.RESPONSE_USER_PASSWORD_NOT_CORRECT,
                    message: 'Password not correct.'
                });
            }
        }
    })
    .catch(function (err) {
      return res.json(err);
    });
}


Queries.prototype.signUpUser = function(res,req,params){
    var query = 'SELECT * FROM  "Users" WHERE "Users"."username" = \''+params.username+'\'';
    var self = this;

    this.db.task(t => {
        // check if user already exists
        return t.any(query)
            .then(user => {

                // user does not exists with same name
                if(user.length == 0){

                    var encryptedPassword = passwordHash.generate(params.password);

                    // insert the user into database
                    self.db.one('INSERT INTO "Users"("username","password") '
                                +'VALUES($1,$2) returning id',[params.username,encryptedPassword])
                    .then(data => {
                        self.db.one('INSERT INTO "UserCredentials"("UserID","CredentialID") ' 
                                +'VALUES($1,$2) returning "UserID"',[data.id,params.credentials])
                        .then(data=>{
                                res.json({
                                    type: self.codes.RESPONSE_OK,
                                    message: 'success',
                                    data: data
                                });
                        });
                     });                
                }
                else{
                    // user with the username already exists
                    res.json({
                        type: '404',
                        message: 'User already exists'
                    });
                }
            });
    })
    .catch(error => {
        // if no data returned this will be called.
        res.send({message:"error", events: error});
    });
}




module.exports = Queries;
