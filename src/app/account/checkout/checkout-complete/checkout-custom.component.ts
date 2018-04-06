import { Component, OnInit } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { CartService } from '../../../cart/cart.service';
import { AuthService } from '../../../shared/auth/auth.service';
import {User} from '../../../shared/user/user';
@Component({
  selector: 'app-checkout-custom',
  templateUrl: './checkout-custom.component.html',
  styleUrls: ['../../../shared/styles/hero.scss', './checkout-complete.component.scss', '../../../shared/styles/mobile.scss']
})
export class CheckoutCustomComponent implements OnInit {

  charge:any;
  customer:any;
  track:any;
  user:User;

  constructor(
    private cartService:CartService,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUserSource();
    //this.track = this.cartService.getCartSource()[0];
    //this.track.license = this.user.license[this.user.license.length-1];

  }

}
