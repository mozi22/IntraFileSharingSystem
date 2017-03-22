
/** Default Imports */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

/** Services */
import { BaseService } from './_services/base.service';
import { LoginService } from './_services/login.service';
import { DashboardService } from './_services/dashboard.service';
import { CategoryService } from './_services/category.service';


/** Routes */
import { AppRoutingModule } from './app-routing.module';

/** Pipes */
import { FilterPipe } from './pipes/filterposts.pipe';


/** Libraries */
import { Select2Module } from 'ng2-select2';
import { MdSlideToggleModule } from '@angular2-material/slide-toggle';
import { FileUploadModule } from "ng2-file-upload";

/** custom components */
import { SideNavComponent } from './side-nav/index';
import { UploadsListComponent } from './uploads-list/index';
import { LoginComponent } from './login/index';
import { DashboardComponent } from './dashboard/index';
import { PageNotFoundComponent } from './page-not-found/index';
import { AddFilesComponent } from './add-files/index';
import { FilterHeaderComponent } from './filter-header/index';
import { FileUploadFormComponent } from './file-upload-form/index';
import { FiltersComponent } from './filters/index';
import { FiltersListComponent } from './filters-list/index';
import { InlineEditComponent } from './inline-edit/index';
import { SignupComponent } from './signup/index';
import { UserslistComponent } from './userslist/index';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    DashboardComponent,
    SideNavComponent,
    UploadsListComponent,
    AddFilesComponent,
    FilterHeaderComponent,
    FileUploadFormComponent,
    FiltersComponent,
    FiltersListComponent,
    InlineEditComponent,
    FilterPipe,
    SignupComponent,
    UserslistComponent
  ],
  imports: [
    BrowserModule,
    FileUploadModule,
    FormsModule,
    HttpModule,
    Select2Module,
    MdSlideToggleModule,
    AlertModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    BaseService,
    LoginService,
    DashboardService,
    CategoryService,
  ],
  schemas:     [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})


export class AppModule { }
