import { NgModule, Injectable } from '@angular/core';
import { Http ,  Response,  Headers, RequestOptions  } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BaseService } from './base.service';
import { CurrentUser } from '../models/current_user';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoginService extends BaseService {

  constructor(public http: Http, public baseService: BaseService) {
    super();
  }

  public verifyLogin(current_user: CurrentUser): Observable<any>{

<<<<<<< HEAD
        return this.http.post(this.baseService.base_url+"/login",JSON.stringify(current_user), this.options)
=======
        return this.http.post(this.baseService.base_url+"/login",JSON.stringify(current_user), this.options) 
>>>>>>> 7326eab94d17b82c001f6d4f5c532d8f6864d4ec
                         .map(this.extractData) 
                         .catch(this.handleError);
        
      }


}