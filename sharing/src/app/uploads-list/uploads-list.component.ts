import { Component, Input, Pipe, PipeTransform, OnChanges, SimpleChanges } from '@angular/core';
import { Post } from '../models/posts';
import { DashboardService } from '../_services/dashboard.service';
import { Observable } from 'rxjs/Rx';
import { BaseService } from '../_services/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uploads-list',
  templateUrl: './uploads-list.component.html',
  styleUrls: ['./uploads-list.component.css', '../assets/css/styles.css'],
})

export class UploadsListComponent{
  @Input() postss: Post[];
  @Input() category: string = "";
  @Input() selectedCategory: string = "0";
  @Input() enableDeletion: boolean = false;

  selectedPostID: number = 0;

  allposts: Post[];
  filteredPosts: Post[];

  user_id: string;
  access_token: string;
  base_url: string;

  constructor(private dashboardService: DashboardService,public router: Router, public baseService: BaseService) {
    if(!baseService.alreadyLoggedIn(router)){
      router.navigateByUrl('/login');
      return;
    }
    this.base_url = this.dashboardService.base_url;
  }

  ngAfterViewInit() {
    this.user_id = localStorage.getItem("user_id");
    this.access_token = localStorage.getItem("access_token");

    $(function () {
      (<any>$('[data-toggle="tooltip"]')).tooltip();
    });
  }


  downloadFileFromServer(filename: string){
          let getfile:Observable<any>;
      getfile = this.dashboardService.downloadFile(filename);
      getfile.subscribe(
        (result) => {

          if(result.type == "200"){
          }
        },
        (err) => console.log(err),
        ()=> console.log("")
        );

  }

  selectedDeletionPost(id:number){
    this.selectedPostID = id;
  }

  deletePost(){

    let deletepost:Observable<any>;
    deletepost = this.dashboardService.deletePost(this.selectedPostID);
    deletepost.subscribe(
        (result) => {

          if(result.type == "200"){
            // now remove item from the view also.
            this.removeItemFromList();
          }
        },
        (err) => console.log(err),
        ()=> console.log("")
        );
  }
  public removeItemFromList(){
    let index = this.arrayObjectIndexOf(this.postss,this.selectedPostID,"id");
    this.postss.splice(index,1);
  }

  private arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
 }



}
