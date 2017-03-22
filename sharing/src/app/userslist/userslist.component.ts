import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BaseService } from '../_services/base.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../models/current_user';
import { Observable } from 'rxjs/Rx';
import { DashboardService } from '../_services/dashboard.service';

@Component({
  selector: 'userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css', '../assets/css/styles.css'],
})


export class UserslistComponent {
    active: string = "active";

    current_user: CurrentUser = new CurrentUser();
    userslist: Array<CurrentUser> = new Array<CurrentUser>();
    cpassword: string = "";

    selectedUserID: number;
    errorMessage: string = "";
    error_type: string = "";
    constructor(public dashboardservice:DashboardService){
        
        this.getUsers();
    }

    getUsers(){

      let getDashboardUsersOperation:Observable<any>;

      getDashboardUsersOperation = this.dashboardservice.getUsers();

      getDashboardUsersOperation.subscribe(
        (posts) => { 

          if(posts.type == "200"){
            this.userslist = posts.data;
          }
          else{
          }
        },
        (err) => console.log(err),
        ()=> console.log("done")
        );
    }

    ngAfterInitView(){
        this.current_user.password = "";
        this.current_user.username = "";
        $('#userslist_error_messages').hide();
    }

    setModalValues(username:string,id:number){
        this.current_user.username = username; 
        this.selectedUserID = id;
    }

    public showMessage(param){
        this.errorMessage = param.message;
        this.error_type = param.type;
        $('#userslist_error_messages').show().delay(2000).fadeOut();
    }

    updateUserDetails(){
        if(this.cpassword != this.current_user.password && (this.cpassword != "" && this.current_user.password != "")){
            this.showMessage({ message: 'Passwords not matching', type: 'danger'});
        }

      this.current_user.id = this.selectedUserID;

      let updateUser:Observable<any>;

      updateUser = this.dashboardservice.updateUser(this.current_user);
      updateUser.subscribe(
        (posts) => { 

          if(posts.type == "200"){
            this.showMessage({ message: 'User Updated', type:'success'});
            this.getUsers();
            this.current_user.password = "";
            this.current_user.username = "";
            this.cpassword = "";
          }
          else{
          }
        },
        (err) => console.log(err),
        ()=> console.log("done")
        );
    }
}