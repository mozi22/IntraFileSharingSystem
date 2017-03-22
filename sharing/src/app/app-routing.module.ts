import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/index';
import { LoginComponent } from './login/index';
import { DashboardComponent } from './dashboard/index';
import { AddFilesComponent } from './add-files/index';
import { FiltersComponent } from './filters/index';
import { SignupComponent } from './signup/index';
import { UserslistComponent } from './userslist/index';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'adduser', component: SignupComponent },
  { path: 'filters', component: FiltersComponent },
  { path: 'userslist', component: UserslistComponent },
  { path: 'newfile', component: AddFilesComponent },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
