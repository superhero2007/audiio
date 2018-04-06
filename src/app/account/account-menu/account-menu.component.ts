import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css', '../../shared/styles/mobile.scss']
})
export class AccountMenuComponent implements OnInit {

  constructor(
              private authService: AuthService,
              private router: Router,
  ) {}

  ngOnInit() {
  }

  onLogout(){
    localStorage.clear();
    this.authService.logout();
    this.router.navigate(['/']);
    location.reload();
  }

}
