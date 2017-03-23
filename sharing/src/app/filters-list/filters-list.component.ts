import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Category } from '../models/categories';
import { CategoryService } from '../_services/category.service';

@Component({
  selector: 'filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.css', '../assets/css/styles.css'],
})


export class FiltersListComponent implements OnChanges {
  public active: String = "active";
  public errorMessage: string = "";
  public error: boolean = false;
  public error_type: string= "danger";

  public selectedDeleteItemID: string;

  @ViewChild('inlineEdit') inlineEdit;
  @Input() categories: Category[];

  constructor(private categoryService: CategoryService){}



  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log(changes);
  }
  ngAfterViewInit() {
    $('#category_error_messages').hide();
  }

  public showMessage(param){
      this.errorMessage = param.message;
      this.error_type = param.type;
      $('#category_error_messages').show().delay(2000).fadeOut();
  }

  public setSelectedDeleteItemID(id:string){
    this.selectedDeleteItemID = id;
  }

  public removeItemFromList(){
    let index = this.arrayObjectIndexOf(this.categories,this.selectedDeleteItemID,"id");
    this.categories.splice(index,1);
  }

  private arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (this.categories[i][property] === searchTerm) return i;
    }
    return -1;
 }
    public deleteCategory(){

            let categoryOperation = this.categoryService.deleteCategory(this.selectedDeleteItemID);
            categoryOperation.subscribe(
                (category) => { 

                if(category.type == "200"){
                  this.showMessage({ message: "Category deleted successfully.", type:"success"});
                  this.removeItemFromList();
                }
                else{
                  this.showMessage({ message: "There are records for this key.", type:"danger"});
                }
                },
                (err) => console.log(err),
                ()=> console.log("done")
                );
    }


}
