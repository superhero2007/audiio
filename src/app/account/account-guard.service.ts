import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {MdDialog, MdSnackBar} from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/user/user';

@Injectable()
export class AccountGuardService implements CanActivate{

  isAuthenticated:Boolean = false;
  user:User;
  url:string;
  constructor(
    private router:Router,
    public dialog: MdDialog,
    private authService:AuthService
  ) {

  }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean {
    this.url = state.url;
    return this.verifyLogin(this.url);
  }

  verifyLogin(url){
    this.user = this.authService.getUserSource();

    if(this.user != undefined){
      return true;
    }
    let loginForm = this.dialog.open(LoginComponent, {disableClose:true});
    loginForm.afterClosed().subscribe(result => {
      let url = this.url;
      if(result !== undefined){
        this.router.navigate([url])
      }
    });
    return false;
  }
}

