import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/user/user'
import { MdDialog, MdSnackBar, MdDialogRef } from '@angular/material';
import { SignUpComponent } from '../sign-up/sign-up.component';
import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';
import {DialogService} from '../shared/dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../shared/styles/mobile.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() backward = new EventEmitter();

  error;
  user:User;
  form : FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private dialogService:DialogService,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<LoginComponent>
  ) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      email: '',
      password: '',
      remember: true
    })
    this.dialogService.setIsOpen(true);
  }

  ngOnDestroy() {
    this.dialogService.setIsOpen(false);
  }

  submitForm(form: any):void{

    this.error = '';
    if(form.get('email').value == '' || form.get('password').value == '')
    {
      this.error = "Please enter your account email and password"
    }

    if(this.error == null || this.error == '') {
      this.authService.getIsAuthenticated(form).subscribe(
        (user) => {

          //this.dialog.closeAll();
          this.dialogRef.close(user);
        },
        (err) => {
          this.error = err;
        },
        () => { }
      )
    }
  }

  onSignUp() {
    this.dialog.closeAll();
    this.dialog.open(SignUpComponent)
  }
  onForgotPassword() {
    this.dialog.closeAll();
    this.dialog.open(ForgotPasswordComponent)
  }
  onClose(){
    this.dialog.closeAll();
    this.dialogService.setIsOpen(false);
  }

}
