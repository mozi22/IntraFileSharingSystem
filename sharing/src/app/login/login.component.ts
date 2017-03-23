import { Component } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { BaseService } from '../_services/base.service';

import { CurrentUser } from '../models/current_user';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})



export class LoginComponent {

    private current_user: CurrentUser = new CurrentUser();

    public errorMessage: string = "";
    public error: boolean = false;

    constructor(private loginService: LoginService,public router: Router, public baseService: BaseService) {
      if(baseService.alreadyLoggedIn(router)){
        router.navigateByUrl('/dashboard');
      }
    }



    private verifyLogin () {

      let userOperation:Observable<any>;

      userOperation = this.loginService.verifyLogin(this.current_user);
      
       userOperation.subscribe(
        (body) => { 


          if(body.type == "200"){

            /** We retrieved the data successfully hence we can move to dashboard for this user. */
            localStorage.setItem("access_token",body.data[0].access_token);
            localStorage.setItem("user_credential",body.data[0].CredentialID);
            localStorage.setItem("user_id",body.data[0].id);

            this.router.navigateByUrl('/dashboard');

          }
          else{
            this.errorMessage = body.message;
            this.error = true;
          }
        },
        (err) => console.log(err),
        ()=> console.log("done")
        );

    }
}
