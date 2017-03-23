import { Component,OnInit, Input } from '@angular/core';
import { FileUploader, FileItem  } from 'ng2-file-upload';
import { BaseService } from '../_services/base.service';
import { Select2OptionData } from 'ng2-select2';
import { Observable } from 'rxjs/Rx';
import { DashboardService } from '../_services/dashboard.service';

@Component({
  selector: 'file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.css', '../assets/css/styles.css']
})


export class FileUploadFormComponent {

    constructor(private dashboardService: DashboardService,
                public baseService: BaseService) {

      this.getCategories();
    }


  public selectedCategory: string = "0";
  public uploader:FileUploader = new FileUploader({url: this.baseService.base_url+'/uploadfile'});
  public hasBaseDropZoneOver:boolean = false;

  public title: string = "";
  public description: string = "";
  public errorMessage: string = "";
  public error_type: string = "";

  public resetDisabled: boolean = true;
  public submitDisabled: boolean = true;

  public showProgress: boolean = false;

  public fileUploadsCount: number = 0;

  /** 
   *  The onBuildItemForm is called for each uploaded document and we dont want to save the same value again and again
   *  for each document. Hence we use this variable to check if this is the firstTime or second time. Once all the files
   *  are uplaoded, this variable will be reset.
   */
  public firstTimeUpload = true;

  @Input() exampleData: Array<Select2OptionData>;

  ngOnInit(){
    this.applyEventsToUploader();
  }



  public applyEventsToUploader(){

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {

      form.append( 'title', this.title  );
      form.append( 'description', this.description  );
      form.append( 'category', this.selectedCategory);
      form.append( 'firstTime', this.firstTimeUpload);
      form.append( 'access_token', localStorage.getItem("access_token"));
      form.append( 'id', localStorage.getItem("user_id"));

      this.submitDisabled = true;
      this.resetDisabled = true;
      this.showProgress = true;

    };

    this.uploader.onCompleteItem = (data: any) => {

      // first file is uploaded, now only add the file not the data(description, title. etc).
      this.firstTimeUpload = false;
      this.showProgress = false;

    };

    this.uploader.onAfterAddingFile = () => {
      this.submitDisabled = false;
      this.resetDisabled = false;
      this.fileUploadsCount += 1;
    };

    /** File uploade complete. So now reset all the fields and show a success message. */
    this.uploader.onCompleteAll = () => {
      /** Showing success message */
      this.showMessage({errorMessage: "Data uploaded successfully",error_type: "success"});
      this.resetDisabled = false;
    };
  }

  updateFileCount(){

      this.fileUploadsCount -= 1;

      /** No files to upload. Hence disable the buttons. */
      if(this.fileUploadsCount == 0){
        this.submitDisabled = true;
        this.resetDisabled = true;
      }
  }

  valueChanged(value: any){
    this.selectedCategory = value.value;
  }


  private resetFields(){
      /** Resetting fields */
      this.uploader = new FileUploader({url: this.baseService.base_url+'/uploadfile'});
      this.title = "";
      this.description = "";
      this.firstTimeUpload = true;
      this.fileUploadsCount = 0;
      this.submitDisabled = true;
      this.resetDisabled = true;
      this.applyEventsToUploader();
  }

  private getCategories(){

      let getCategories:Observable<any>;
      getCategories = this.dashboardService.getCategories();
      getCategories.subscribe(
        (categories) => {

          if(categories.type == "200"){
            this.exampleData = categories.data;
          }
        },
        (err) => console.log(err),
        ()=> console.log("done")
        );
    }
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  ngAfterViewInit() {
    $('#upload_error_messages').hide();
  }

  public showMessage(param){
      this.errorMessage = param.message;
      this.error_type = param.type;
      $('#upload_error_messages').show().delay(2000).fadeOut();
  }

}
