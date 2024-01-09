import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketManagementService } from '../../service/ticket-management.service'
import { Router } from '@angular/router';
import { Users } from '../../interface/users';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginFormData: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
  })

  usersData: Users[] = [];

  constructor(private userService: TicketManagementService, private router: Router, private message:NzMessageService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (user) => this.usersData = user ,
      error: (error) => console.log(error)
    })
  }

  resetForm() {
    this.loginFormData.reset();
  }

  login() {
    if (!this.loginFormData.valid) {
      Object.values(this.loginFormData.controls).forEach((control: AbstractControl) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let userExist: boolean = false;
    this.usersData.filter(user => {
      if (user.email === this.loginFormData.value.email && user.password === this.loginFormData.value.password) {
        userExist = true;
        this.userService.setLoggedInUser(user.id);
        this.router.navigate(['/project'])
      }
    });

    if (!userExist) {
      this.message.error("Please enter valid login credentials!");
    }
    else {
      this.message.success("Login successful");
      this.resetForm();
    }
  }
}
