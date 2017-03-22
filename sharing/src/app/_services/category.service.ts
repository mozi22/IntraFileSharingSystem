import { NgModule, Injectable } from '@angular/core';
import { Http , Response,  Headers, RequestOptions, URLSearchParams  } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BaseService } from './base.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CategoryService extends BaseService {

  constructor(public http: Http, public baseService: BaseService) {
      super();
  }

  public updateCategory(categoryid: string, categoryname: string): Observable<any>{


        let user_id = localStorage.getItem("user_id");
        let access_token = localStorage.getItem("access_token");

        let params = {
            "id": user_id,
            "access_token": access_token,
            "catid": categoryid,
            "categoryname": categoryname
        };


        return this.http.post(this.baseService.base_url+"/updatecategory",JSON.stringify(params), this.options)
                         .map(this.extractData) 
                         .catch(this.handleError);
    }

    public deleteCategory(categoryid: string): Observable<any>{

        let user_id = localStorage.getItem("user_id");
        let access_token = localStorage.getItem("access_token");

        let params = {
            "id": user_id,
            "access_token": access_token,
            "catid": categoryid,
        };


        return this.http.post(this.baseService.base_url+"/deletecategory",JSON.stringify(params), this.options)
                         .map(this.extractData) 
                         .catch(this.handleError);
    }
  public insertCategory(categoryname: string): Observable<any>{

        let user_id = localStorage.getItem("user_id");
        let access_token = localStorage.getItem("access_token");

        let params = {
            "id": user_id,
            "access_token": access_token,
            "categoryname": categoryname
        };


        return this.http.post(this.baseService.base_url+"/insertcategory",JSON.stringify(params), this.options)
                         .map(this.extractData) 
                         .catch(this.handleError);
    }
}