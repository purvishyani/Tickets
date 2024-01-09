import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketManagementService } from '../../service/ticket-management.service'
import { Users } from '../../interface/users';
import { Project } from '../../interface/project'
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-new-user-modal',
  templateUrl: './add-new-user-modal.component.html',
  styleUrls: ['./add-new-user-modal.component.scss']
})
export class AddNewUserModalComponent {
  @Output() addNewUserModal = new EventEmitter();


  isVisible = false;
  usersList: string[] = [];
  allUsers: Users[] = [];
  newUsersList: string[] = [];
  projectId!: string;
  currentProjectData: Project[] = [];
  dummy: string[] = [];

  newUserFormData: FormGroup = new FormGroup({
    selectedUsers: new FormControl([], Validators.required)
  })

  constructor(private userService: TicketManagementService, private message: NzMessageService) { }

  ngOnInit() {

    this.userService.getUsers().subscribe({
      next: (users) => this.allUsers = users,
      error: (error) => this.message.error(error)
    });

    this.userService.getProjects().subscribe({
      next: (project) => this.currentProjectData = project,
      error: (error) => this.message.error(error)
    })
  }

  openModal() {
    this.isVisible = true;
    this.usersList = this.userService.getSelectedUsers();
    this.dummy = [];

    this.allUsers.forEach((item) => {
      this.dummy.push(item.firstName);
    })
    this.newUsersList = this.dummy.filter(item => this.usersList.includes(item));
    
    this.newUserFormData.patchValue({
      selectedUsers: this.newUsersList
    })
  }

  handleCancel() {
    this.newUserFormData.reset();
    this.isVisible = false;
  }

  addNewUser() {
    if (!this.newUserFormData.valid) {
      Object.values(this.newUserFormData.controls).forEach((control: AbstractControl) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.projectId = this.userService.getLatestProjectID();
    this.currentProjectData = this.currentProjectData.filter((item) => item.id === this.projectId);

    this.currentProjectData.forEach((item) => {
      item.selectedUsers = this.newUserFormData.value.selectedUsers;
      this.userService.updateProject(this.projectId, item).subscribe({
        next: () => {
          this.message.info("Users updated successfully!")
          this.addNewUserModal.emit();
        },
        error: (error) => this.message.error(error)
      });
    });
    this.isVisible = false;
  }

}