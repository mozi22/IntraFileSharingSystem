

var  codes = function(){

    this.CATEGORIES_GET_ALL_CATEGORIES          = "41";
    this.CATEGORIES_RETURN_ALL_CATEGORIES          = "42";
    this.CATEGORIES_INSERT_CATEGORY = "43";
    this.CATEGORIES_UPDATE_CATEGORY = "44";
    this.CATEGORIES_DELETE_CATEGORY = "45";


    this.USER_SIGN_UP               = "1";
    this.USER_LOGIN                 = "2";
    this.USER_CHECK_NAME_UNIQUE     = "3";
    this.USER_GET_ID                = "4";
    this.USER_GET_DETAILS           = "5";
    this.USER_GET_DETAILS_FROM_ID   = "6";
    this.USER_VERIFY_USER           = "7";
    this.USER_START_SIGN_UP         = "8";
    this.GET_ALL_USERS              = "9";
    this.UPDATE_USER_DETAILS        = "10";
    


    /** This is incase we don't want to handle the callback. */


    this.POSTS_GET_USER_DASHBOARD               = "21";
    this.POSTS_RETURN_USER_DASHBOARD            = "23";
    this.POSTS_RETURN_CATEGORIES                = "24";
    this.POSTS_INSERT_NEW_DETAILS               = "25";
    this.POSTS_GET_USER_PERSONAL_DASHBOARD      = "26";
    this.POSTS_DOWNLOAD_FILE      = "27";

    
    this.CODE_LOGOUT            = "1010";
    this.NULL_RESULT            = "2000";




    this.RESPONSE_OK = "200";
    this.RESPONSE_USER_ALREADY_EXISTS = "201";
    this.RESPONSE_USER_NOT_CREATED = "202";
    this.RESPONSE_USER_NOT_FOUND = "203";
    this.RESPONSE_USER_PASSWORD_NOT_CORRECT = "204";
    this.RESPONSE_POSTS_NO_MORE_RECORDS = "205";
    this.RESPONSE_POSTS_CANT_FIND_CATEGORIES = "206";
}

module.exports = codes;
