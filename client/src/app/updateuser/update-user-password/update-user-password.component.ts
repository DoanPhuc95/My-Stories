import { Component } from '@angular/core';
import { InfoUserComponent } from '../../info-user/info-user.component'


@Component({
  selector: 'app-update-user-password',
  templateUrl: './update-user-password.component.html',
  styles: [
    `
      .form {
        width: 500px;
      }
      
      .full-width {
        width: 100%;
      }
    `
  ],
  providers: [ InfoUserComponent ]
})
export class UpdateUserPasswordComponent {

  constructor() {
  }

  onSubmit(value: any) {
    console.log(value);
  }
}
