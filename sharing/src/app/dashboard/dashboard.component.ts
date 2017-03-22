import { Component, Input, OnChanges, SimpleChanges,  ViewChild  } from '@angular/core';
import { DashboardService } from '../_services/dashboard.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BaseService } from '../_services/base.service';
import { Http ,  Response,  Headers, RequestOptions  } from '@angular/http';
import { Post } from '../models/posts';
import { Category } from '../models/categories';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css','../assets/css/styles.css'],
})


export class DashboardComponent  {

  public active1: string = "active";
  public active3: string = "";

  public page_title: string = "Recent Uploads";

  public myfiles_active:string = "";
  public posts: Array<Post> = new Array<Post>();
  public categories: Category[];
  public selectedCategory: string = "0";
  public lastPostID: string = "";
  public errorMessage: string;
  public hide_load_more:boolean = true;
  public disable_load_more:boolean = false;


  public user_posts_only: boolean = false;

    constructor(private dashboardService: DashboardService,
                public router: Router,
                public baseService: BaseService) {

      if(!baseService.alreadyLoggedIn(router)){
        router.navigateByUrl('/login');
        return;
      }

      this.getRecentPosts("-1");
      this.getCategories();
    }

    public getUserPosts(){

      this.hide_load_more = true;
      this.posts = new Array<Post>();

      if(this.user_posts_only){
        this.page_title = "Recent Uploads";
        this.getRecentPosts("-1");
        this.user_posts_only = false;
        return;
      }

      this.page_title = "My Uploads";
      this.user_posts_only = true;


      this.active1 = "";
      this.active3 = "active";
      this.errorMessage = "loading more records...";
      this.posts = undefined;
      this.page_title = "My Uploads";
      
      let getDashboardOperation:Observable<any>;

      getDashboardOperation = this.dashboardService.getUserDashboardPosts("-1",localStorage.getItem("user_id"));
      this.getPosts(getDashboardOperation);
    }

    public getPosts(getDashboardOperation){
      console.log("call with userid = "+localStorage.getItem("user_id"));
      getDashboardOperation.subscribe(
        (posts) => { 
          console.log("the number of posts returned = "+posts.data.length);
          if(posts.type == "200"){

            if(posts.data.length == 0){
              this.hide_load_more = false; 
            }

            this.organizeData(posts.data);
            this.disable_load_more = false;
          }
          else{
            this.errorMessage = "No More records";
          }
        },
        (err) => console.log(err),
        ()=> console.log("")
        );
    }

    /** 
     * Data is returned in tabular form. Which means if a post has 3 uploaded files.
     * Than there will be 3 rows for that single record. We need to show all of them as one.
     * Hence we'll organize our data in this function
     */
    private organizeData(data){

      let currentId: number = -1; 
       let p = new Post();

       if(this.posts === undefined){
         this.posts = new Array<Post>();
       }

      for(let item of data){

        if(currentId == -1 || currentId!=item.id){

          p = new Post();
          currentId = item.id;

          p.category = item.category;
          p.catid = item.catid;
          p.description = item.description;
          p.id = item.id;
          p.created_at = item.created_at.replace("T", " ").substring(0, item.created_at.length - 5);
          p.title = item.title;
          p.userid = item.userid;
          p.username = item.username;
          p.filePath.push(item.FilePath);

          this.posts.push(p);
        }
        else{
          p.filePath.push(item.FilePath);
        }

      }
    }

    private getCategories(){

      let getCategories:Observable<any>;
      getCategories = this.dashboardService.getCategories();
      getCategories.subscribe(
        (categories) => {

          if(categories.type == "200"){
            categories.data.unshift({ id: "0", text: "All" });
            this.categories = categories.data;
          }
        },
        (err) => console.log(err),
        ()=> console.log("done")
        );
    }

    setCurrentCategory(category:any):void{
      this.selectedCategory = category.value;
    }


    private loadMorePosts(){
      this.disable_load_more = true;
      this.lastPostID = this.posts[this.posts.length - 1].id.toString();
      if(!this.user_posts_only){
        this.getRecentPosts(this.lastPostID);
        return;
      }

      let getDashboardOperation:Observable<any>;

      getDashboardOperation = this.dashboardService.getUserDashboardPosts(this.lastPostID,localStorage.getItem("user_id"));

      this.getPosts(getDashboardOperation);
    }
   
    private getRecentPosts(lastpostid){

      let getDashboardOperation:Observable<any>;

      this.errorMessage = "loading more records...";

      getDashboardOperation = this.dashboardService.getDashboardPosts(lastpostid);
      this.getPosts(getDashboardOperation);
    }
  }
