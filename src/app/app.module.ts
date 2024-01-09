import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NewProjectComponent } from './project/new-project/new-project.component'
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { ToastrModule } from 'ngx-toastr';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AddBadgeModalComponent } from './modals/add-badge-modal/add-badge-modal.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AddProjectModalComponent } from './modals/add-project-modal/add-project-modal.component';
import { NewBoardModalComponent } from './modals/new-board-modal/new-board-modal.component';
import { AddCardModalComponent } from './modals/add-card-modal/add-card-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AddNewUserModalComponent } from './modals/add-new-user-modal/add-new-user-modal.component';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NewProjectComponent,
    AddBadgeModalComponent,
    AddProjectModalComponent,
    NewBoardModalComponent,
    AddCardModalComponent,
    AddNewUserModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    ReactiveFormsModule,
    NzTypographyModule,
    NzAvatarModule,
    NzCardModule,
    NzDividerModule,
    NzAlertModule,
    ToastrModule.forRoot(),
    NzModalModule,
    NzRadioModule,
    NzGridModule,
    FontAwesomeModule,
    NzSelectModule,
    DragDropModule,
    NzToolTipModule,
    NzMessageModule,
    NzDropDownModule,
    NzPopconfirmModule,
    NzIconModule

  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
