import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import { User } from '../shared/user/user'
import { AuthService } from '../shared/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { LoginComponent } from '../login/login.component';
import {MdDialog} from '@angular/material';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  isSent:boolean = false;
  error;
  user:User;
  form : FormGroup;
  token:string;
  sub:Subscription;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private route:ActivatedRoute,
    private router:Router,
    public dialog:MdDialog,

  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      (params) => {
        this.token = params.token;
      });
    this.form = this.fb.group({
      token:this.token,
      password: '',
    })
  }

  submitForm(form: any):void{

    this.error = '';
    if(form.get('password').value == '')
    {
      this.error = "Please enter a password"
    }

    if(this.error == null || this.error == '') {
      this.authService.passwordReset(form).subscribe(
        (data) => {
          let loginForm = this.dialog.open(LoginComponent, {disableClose:true});
          loginForm.afterClosed().subscribe(result => {
            if(result !== undefined){
              this.router.navigate(['/browse']);
            }
          });
        },
        (err) => {
          this.error = err;
        },
        () => { }
      )
    }
  }

}
