import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

import { formBounce} from '../shared/app.page-animations';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/user/user'
import { InviteComponent } from '../invite/invite.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-sign-up-2',
  templateUrl: './sign-up-2.component.html',
  styleUrls: ['./sign-up.component.css'],
  //animations: [ formBounce ],

})
export class SignUp2Component implements OnInit {

  form : FormGroup;
  user: User;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MdDialog,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUserSource();
    this.form = this.fb.group({
      company_name:['', Validators.required ],
      project_types:['', Validators.required ]
    })
  }

  submitForm(value: any):void{
    this.user = this.authService.getUserSource();
    //this.user.company_name = this.form.get('company_name').value
    //this.user.project_types = this.form.get('project_types').value
    this.authService.create(this.user).subscribe(
      (user)=>{
      }
    );
    //this.router.navigate(['invite']);
    this.dialog.closeAll();
    //this.dialog.open(InviteComponent)
  }
  onLogin(){
    this.dialog.closeAll();
    this.dialog.open(LoginComponent)
  }

}
