import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formBounce} from '../shared/app.page-animations';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/user/user'
import { MdDialog, MdSnackBar } from '@angular/material';


@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['../login/login.component.css','./invite.component.css'],
  //animations: [ formBounce ],

})
export class InviteComponent implements OnInit {

  form : FormGroup;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MdDialog,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email1:'',
      email2:'',
      email3:''
    })
  }

  submitForm(form):void{
    let invite = {
      email1:this.form.get('email1').value,
      email2:this.form.get('email2').value,
      email3:this.form.get('email3').value,
      user:this.authService.userSource
    };
    this.authService.invite(invite).subscribe(
      (invite) => {
        this.dialog.closeAll();
      })
  }

  gotoBrowse(){
    /*this.auth.setUserSource({
      'id':123,
      'firstName':'bill',
      'lastName':'leonard',
      'email':'bleonard@gmail.com'
    })*/
    this.dialog.closeAll();
    this.router.navigate(['/browse']);
  }

}
