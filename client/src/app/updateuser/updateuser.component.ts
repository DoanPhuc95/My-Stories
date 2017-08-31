import { Component, OnInit } from '@angular/core';
import { UpdateUserService } from './updateuser.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { UpdateUserNameComponent } from './update-user-name/update-user-name.component';
import { UpdateUserPasswordComponent } from './update-user-password/update-user-password.component';
import { InfoUserComponent } from '../info-user/info-user.component'

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.css'],
  providers: [ UpdateUserService, FormBuilder, InfoUserComponent, UpdateUserPasswordComponent ]
})

export class UpdateUserComponent implements OnInit {

  constructor(private router: Router, public dialog: MdDialog) { }

  ngOnInit() {
    if (!localStorage.getItem('currentUser')) {
      this.router.navigate(['']);
    }
  }
  onUpdateName(){
    this.dialog.open(UpdateUserNameComponent)
  }
  onUpdatePassword(){
    this.dialog.open(UpdateUserPasswordComponent)
  }
}
