import { Component } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { TicketManagementService } from '../../service/ticket-management.service';
import { Router } from '@angular/router'
import { Users } from '../../interface/users';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  usersData: Users[] = [];
  registerFormData: any;

  constructor(private userService: TicketManagementService, private fb: NonNullableFormBuilder, private router: Router, private message: NzMessageService) {
    this.registerFormData = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      id: uuid()
    });
  }

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (users) => this.usersData = users,
      error: (error) => this.message.error(error)
    })
  }

  register() {
    if (!this.registerFormData.valid) {
      // Object.values(this.registerFormData.controls).forEach((control: any) => {
      //   if (control.invalid) {
      //     control.markAsDirty();
      //     control.updateValueAndValidity({ onlySelf: true });
      //   }
      // });
      return;
    }

    if (this.registerFormData.value.password === this.registerFormData.value.confirmPassword) {
      let existEmail: boolean = false;
      this.usersData.filter(user => existEmail = user.email === this.registerFormData.value.email ? true : false);
      if (!existEmail) {
        this.userService.saveUsers(this.registerFormData.value).subscribe({
          next: () => {
            this.message.success("Your registration done successfully!");
            this.reset();
            this.router.navigate(['/project'])
          },
          error: (error) => this.message.error(error)
        })
      }
      else {
        this.message.warning('This email is already exists!')
      }
    }
    else {
      this.message.warning('Please have password and confirm password same')
    }
  }

  reset() {
    this.registerFormData.reset();
  }
}
