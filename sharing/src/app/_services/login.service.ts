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

        return this.http.post(this.baseService.base_url+"/login",JSON.stringify(current_user), this.options) 
                         .map(this.extractData) 
                         .catch(this.handleError);
        
      }


}