import { Component } from '@angular/core';

@Component({
  selector: 'email-exists-dialog',
  template: `
    <h1 mat-dialog-title>Email Already Exists</h1>
    <div mat-dialog-content>
      The email you entered is already associated with an existing user. Please
      enter another email ID.
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>OK</button>
    </div>
  `,
})
export class EmailExistsDialog {}
