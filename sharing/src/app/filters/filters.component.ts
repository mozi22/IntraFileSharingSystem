import { Component, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DashboardService } from '../_services/dashboard.service';
import { Category } from '../models/categories';
import { BaseService } from '../_services/base.service';
import { Router } from '@angular/router';
import { CategoryService } from '../_services/category.service';

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css', '../assets/css/styles.css'],
})


export class FiltersComponent {
    public active: String = "active";

    public categoryName: string;
    public categories: Category[];
    public errorMessage: string = "";
    public error: boolean = false;
    public error_type: string= "danger";

    @ViewChild('filterList') filterList;

    constructor(private dashboardService: DashboardService,
                public router: Router,
                public categoryService: CategoryService,
                public baseService: BaseService) {
      if(!baseService.alreadyLoggedIn(router)){
        router.navigateByUrl('/login');
        return;
      }
      this.getCategories();
    }

    public insertCategory(){
      let categoryOperation = this.categoryService.insertCategory(this.categoryName);
      categoryOperation.subscribe(
        (categories) => { 

          if(categories.type == "200"){

            this.categoryName = "";
            this.getCategories();
            this.filterList.showMessage({ message: "Categories saved successfully.", type: "success"});
          }
          else{
            this.filterList.showMessage({ message: "Something went wrong !!!. Category not inserted", type: "danger"});
          }
        },
        (err) => console.log(err),
        ()=> console.log("done")
        );
    }

    private getCategories(){

      let getCategories:Observable<any>;
      getCategories = this.dashboardService.getCategories();
      getCategories.subscribe(
        (categories) => { 

          if(categories.type == "200"){
            this.categories = categories.data;
          }
        },
        (err) => console.log(err),
        ()=> console.log("done")
        );
    }
}
