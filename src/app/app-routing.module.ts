import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/authentication/login/login.component';
import { RegisterComponent } from '../app/authentication/register/register.component';
import { NewProjectComponent } from '../app/project/new-project/new-project.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'project/:id', component: NewProjectComponent },
  { path: 'project', component: NewProjectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
