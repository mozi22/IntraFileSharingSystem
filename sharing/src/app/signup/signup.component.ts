import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BaseService } from '../_services/base.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../models/current_user';
import { Observable } from 'rxjs/Rx';
import { DashboardService } from '../_services/dashboard.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../assets/css/styles.css'],
})


export class SignupComponent {
    
    current_user: CurrentUser = new CurrentUser();
    cpassword: string = "";
    active: string = "active";
    errorMessage: string;
    error_type: string;
    constructor(private dashboardService: DashboardService,public router: Router, public baseService: BaseService) {

      if(!baseService.alreadyLoggedIn(router)){
        router.navigateByUrl('/login');
        return;
      }
    }

    ngAfterViewInit() {

        this.resetFields();
        $('#signup_error_messages').hide();
    }

  public showMessage(param){
      this.errorMessage = param.message;
      this.error_type = param.type;
      $('#signup_error_messages').show().delay(2000).fadeOut();
  }

  public resetFields(){
      this.current_user.username = "";
      this.current_user.password = "";
      this.current_user.credential = 1;
      this.cpassword = "";
  }

  public saveUser(){

        if(!this.performChecks()) {
            return;
        }


        let userOperation:Observable<any>;

        userOperation = this.dashboardService.saveUser(this.current_user);

        userOperation.subscribe(
        (body) => { 
            if(body.type == "200"){
                this.showMessage({message: 'User added successfully', type:'success'});
            }
            else{
            }
        },
        (err) => console.log(err),
        ()=> console.log("done")
        );
    }


    public performChecks(){
        if(this.current_user.username.trim() == ""){
            this.showMessage({ message: 'Enter a username.', type: 'danger'});
            return false;
        }
        if(this.current_user.password.trim() == ""){
            this.showMessage({ message: 'Enter a Password.', type: 'danger'});
            return false;
        }
        if(this.cpassword.trim() != this.current_user.password.trim()){
            this.showMessage({ message: 'Passwords should match', type: 'danger'});
            return false;
        }

        return true;
    }




}
