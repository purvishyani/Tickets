import { Component, EventEmitter, Output } from '@angular/core';
import { TicketManagementService } from '../../service/ticket-management.service'
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { Users } from '../../interface/users';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.scss']
})

export class AddProjectModalComponent {
  @Output() projectData = new EventEmitter<any>;

  isVisible = false;
  usersList: Users[] = [];
  listOfSelectedValue = [];

  newProjectFormData: FormGroup = new FormGroup({
    projectName: new FormControl('', Validators.required),
    selectedUsers: new FormControl([], Validators.required),
    id: new FormControl(uuid()),
    loggedUserId: new FormControl(this.usersService.getLoggedInUser()),
  })
  constructor(private usersService: TicketManagementService, private tostr: ToastrService, private message: NzMessageService) { }

  ngOnInit() {
    this.usersService.getUsers().subscribe({
      next: (user) => this.usersList = user,
      error: (error: any) => this.message.error(error)
    })
  }

  openModal() {
    this.isVisible = true;
  }

  resetFormData() {
    this.newProjectFormData.reset();
    this.isVisible = false;
  }

  addNewProjectData() {
    if (!this.newProjectFormData.valid) {
      Object.values(this.newProjectFormData.controls).forEach((control: AbstractControl) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.projectData.emit(this.newProjectFormData.value);
    this.usersService.setLastAddedProjectID(this.newProjectFormData.value.id);
    this.usersService.setSelectedUsers(this.newProjectFormData.value.selectedUsers);
    this.usersService.saveProject(this.newProjectFormData.value).subscribe({
      next: () => {
        this.message.success("New project added successfully!")
        this.projectData.emit(this.newProjectFormData.value);
        this.resetFormData();
      },
      error: (error) => this.message.error(error)
    });
  }
}