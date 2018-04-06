import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';
import { formBounce} from '../shared/app.page-animations';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/user/user'
import { MdDialog, MdSnackBar, MdDialogRef } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import {DialogService} from '../shared/dialog.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    '../login/login.component.css',
    './forgot-password.component.css',
    '../shared/styles/mobile.scss'
  ],

})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  error;
  user:User;
  form : FormGroup;
  isSent:boolean=false;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    public dialog: MdDialog,
    private dialogService:DialogService,
    public dialogRef: MdDialogRef<ForgotPasswordComponent>
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      email: ''
    })
    this.dialogService.setIsOpen(true);
  }

  ngOnDestroy() {
    this.dialogService.setIsOpen(false);
  }

  onClose(){
    this.dialog.closeAll();
    this.dialogService.setIsOpen(false);
  }
  onLogin() {
    this.dialog.closeAll();
    this.dialog.open(LoginComponent)
  }

  submitForm(form: any):void{

    this.error = '';
    if(form.get('email').value == '')
    {
      this.error = "Please enter your account email"
    }

    if(this.error == null || this.error == '') {

      this.authService.forgotPassword(form).subscribe(
        (user) => {
          this.isSent = true;
        },
        (err) => {
          this.error = err;
        }
      )
    }
  }

}




