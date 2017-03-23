import { NgModule, Injectable } from '@angular/core';
import { Http , Response,  Headers, RequestOptions, URLSearchParams  } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BaseService } from './base.service';
import { Post } from '../models/posts';
import { CurrentUser } from '../models/current_user';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DashboardService extends BaseService {

  constructor(public http: Http, public baseService: BaseService) {
      super();
  }

  

  public getDashboardPosts(lastpostid: string): Observable<any>{


        let user_id = localStorage.getItem("user_id");
        let access_token = localStorage.getItem("access_token");

        let params = this.getQueryParams();
        params.set('lastpostid', lastpostid);
        params.set('id', user_id);

        return this.http.get(this.baseService.base_url+"/getposts",{search : params})
            .map(this.extractData)
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
  public getUserDashboardPosts(lastpostid: string, postuserid: string): Observable<any>{


        let access_token = localStorage.getItem("access_token");
        let user_id = localStorage.getItem("user_id");

        let params = this.baseService.getQueryParams();
        params.set('lastpostid', lastpostid);
        params.set('postuserid', postuserid);
        params.set('id', user_id);
        
        return this.http.get(this.baseService.base_url+"/userposts",{search : params})
            .map(this.extractData)
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }



    public getCategories(): Observable<any>{


        return this.http.get(this.baseService.base_url+"/categories",{search: this.getQueryParams()})
            .map(this.extractData)
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public downloadFile(filename: string){

        let params = this.getQueryParams();
        params.set('filename', filename);

        return this.http.get(this.baseService.base_url+"/downloadfile",{search: params})
            .map(this.extractData)
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    public saveUser(user: CurrentUser){

        let params = {
            access_token: localStorage.getItem('access_token'),
            id: localStorage.getItem('user_id'),
            username: user.username,
            password: user.password,
            credentials: user.credential
        }

        return this.http.post(this.baseService.base_url+"/signup",JSON.stringify(params), this.options) 
                         .map(this.extractData) 
                         .catch(this.handleError);

    }
    public deletePost(postid: number){

        let params = {
            access_token: localStorage.getItem('access_token'),
            id: localStorage.getItem('user_id'),
            postid: postid
        }

        return this.http.post(this.baseService.base_url+"/deletePost",JSON.stringify(params), this.options) 
                         .map(this.extractData) 
                         .catch(this.handleError);

    }

    public updateUser(user:CurrentUser){

        let params = {
            access_token: localStorage.getItem('access_token'),
            id: localStorage.getItem('user_id'),
            username: user.username,
            password: user.password,
            userid: user.id
        }

        return this.http.post(this.baseService.base_url+"/updateuser",JSON.stringify(params), this.options) 
                         .map(this.extractData) 
                         .catch(this.handleError);
    }

    public getUsers(){

        return this.http.get(this.baseService.base_url+"/getusers",{search: ""})
            .map(this.extractData)
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}