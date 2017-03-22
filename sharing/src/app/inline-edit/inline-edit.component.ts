import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../_services/category.service';

@Component({
    selector: 'inline-edit',
    templateUrl: './inline-edit.component.html',
    styleUrls: ['./inline-edit.component.css'],
})
export class InlineEditComponent {
    private isDisplay = true;
    private errorMessage = "";

    @Input() text: string;
    @Input() id: string;
    @Output() edit = new EventEmitter<string>();
    @Output() deleteItem: EventEmitter<string> = new EventEmitter<string>();
    @Output() updatedItemMessage: EventEmitter<any> = new EventEmitter<any>();

    constructor(private categoryService: CategoryService){}

    beginEdit(el: HTMLElement): void {
        this.isDisplay = false;
    }

    editDone(newText: string): void {
        this.isDisplay = true;

        if(this.text != newText)
        {
            // update in db
            let categoryOperation = this.categoryService.updateCategory(this.id,newText);
            categoryOperation.subscribe(
                (category) => { 

                if(category.type == "200"){
                    this.updatedItemMessage.emit({ message: "Category name updated successfully.", type: "success"});                    
                }
                else{
                    this.updatedItemMessage.emit({ message: "Something went wrong!!!", type: "danger"});                    
                }
                },
                (err) => console.log(err),
                ()=> console.log("done")
                );
        }

        this.text = newText;
    }


    public showWarning(){
        this.deleteItem.emit(this.id);
    }
}