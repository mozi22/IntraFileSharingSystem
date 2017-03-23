import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BaseService } from '../_services/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})


export class SideNavComponent {

    @Input() enabled1: String = "";
    @Input() enabled2: String = "";
    @Input() enabled3: String = "";
    @Input() enabled4: String = "";
    @Input() enabled6: String = "";


    user_signup_disabled: boolean = false;
    ngAfterViewInit() {

      if(localStorage.getItem('user_credential') == "2"){
        this.user_signup_disabled = true;
      }
    }
    
    @Output() getUserPosts = new EventEmitter();

    constructor(public router: Router, public baseService: BaseService) {}

    public logout(){
      this.baseService.logout(this.router);
    }



}
