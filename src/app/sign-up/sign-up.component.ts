import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formBounce} from '../shared/app.page-animations';
import { MdDialog, MdSnackBar } from '@angular/material';
import { SignUp2Component } from '../sign-up/sign-up-2.component';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/user/user'
import { LoginComponent } from '../login/login.component';
import { InviteComponent } from '../invite/invite.component';
import {error} from 'selenium-webdriver';
import {DialogService} from '../shared/dialog.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../shared/styles/mobile.scss'],
  //animations: [ formBounce ],

})
export class SignUpComponent implements OnInit, OnDestroy {

  form : FormGroup;
  user:User;
  error:string;
  headline = "Want to hear the entire song?";
  remember:boolean;

  constructor(
    private fb: FormBuilder,
    public dialog: MdDialog,
    private authService:AuthService,
    private dialogService:DialogService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      fname:[''],
      lname:[''],
      email:[''],
      remember:[true ],
      password:['' ],
      passwordConfirm:['' ]
    })
    this.dialogService.setIsOpen(true);
  }

  ngOnDestroy() {
    this.dialogService.setIsOpen(false);
  }
  onHeadlineUpdate(e){
  }

  submitForm(form:any){
    let valid = false;
    this.error = null;
    this.user = {
      email: this.form.get('email').value,
      last_name: this.form.get('lname').value,
      first_name: this.form.get('fname').value,
      password: this.form.get('password').value
    };
    this.user['remember'] = this.form.get('remember').value;
    //this.dialog.closeAll();
    //this.dialog.open(SignUp2Component);

    if(
      this.user.email == '' ||
      this.user.first_name == '' ||
      this.user.last_name == '' ||
      this.user.password == ''
    ){
      valid = false;
    } else {
        valid = true;
    }

    if(valid) {

      this.authService.create(this.user).subscribe(
        (user) => {

          //this.authService.setUserSource(this.user)
          this.dialog.closeAll();
          this.dialog.open(InviteComponent)
        },
        (error) => {
          this.error = "Must use unique email address.";
        },
        () => {
        }
      );
      //this.router.navigate(['invite']);
      //this.dialog.closeAll();
      //this.dialog.open(InviteComponent)
    } else {
      this.error = "Please fill out the required fields."
    }
  }
  onLogin(){
    this.dialog.closeAll();
    this.dialog.open(LoginComponent)
  }

  onClose(){
    this.dialog.closeAll();
  }

}
