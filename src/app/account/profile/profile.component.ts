import { Component, OnInit } from '@angular/core';
import { formBounce } from '../../shared/app.page-animations';
import {User} from '../../shared/user/user';
import {AuthService} from '../../shared/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../../shared/styles/hero.scss','./profile.component.css', '../account.scss', '../../shared/styles/mobile.scss'],
  // animations: [ formBounce ]
})
export class ProfileComponent implements OnInit {
  form : FormGroup;
  user:User;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.authService.getUserSource();
    this.form = this.fb.group({
      first_name:[this.user.first_name, Validators.required ],
      last_name:[this.user.last_name, Validators.required ],
      email:[this.user.email, Validators.required ],
      address:[this.user.address, Validators.required ],
      city:[this.user.city, Validators.required ],
      state:[this.user.state, Validators.required ],
      postal_code:[this.user.postal_code, Validators.required ]
    })

    this.authService.userSourceUpdated.subscribe(
      (data: User) => {
        this.user = data
      }
    );
    this.user = this.authService.getUserSource();


  }

  resetCache(){
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/']);
  }

  submitForm() {
    this.user = this.authService.getUserSource();
    this.user.first_name =  this.form.get('first_name').value;
    this.user.last_name =  this.form.get('last_name').value;
    this.user.email =  this.form.get('email').value;
    this.user.address =  this.form.get('address').value;
    this.user.city =  this.form.get('city').value;
    this.user.state =  this.form.get('state').value;
    this.user.postal_code =  this.form.get('postal_code').value;
    this.authService.setUserSource(this.user)

    this.authService.update(this.user).subscribe(
      (user)=>{
      },
      (error)=>{
      },
      ()=>{
      }
    );
  }
  onCancel(){

  }

}
