import { NgModule, Injectable  } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http , Response,  Headers, RequestOptions, URLSearchParams  } from '@angular/http';

@Injectable()
export class BaseService {

    public base_url = "http://10.5.163.13:3000";
    public headers;
    public options;

    constructor() {
        this.headers = new Headers({'Content-Type' : 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Headers':'Authorization'});
        this.options = new RequestOptions({ headers: this.headers });
    }

    /** Login Module */

    /**
     *  If the user is already logged in. /login URL will be inaccessable unless the user logs out.
     */
    public alreadyLoggedIn(router){

        if(localStorage.getItem("access_token") !== undefined && 
           localStorage.getItem("access_token") != "" &&
           localStorage.getItem("access_token") != null){
            return true;
        }
        else{
            return false;
        }
    }
    public getQueryParams(){

        let params = new URLSearchParams();
        params.set('id', localStorage.getItem("user_id"));
        params.set('access_token', localStorage.getItem("access_token"));
        return params;
    }

    public logout(router){

        localStorage.setItem("access_token","");
        localStorage.setItem("user_credential","");
        localStorage.setItem("user_id","");

        router.navigateByUrl('/login');
    }

    public handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }


    public extractData(res: Response) {
        return res.json() || { };
    }

}