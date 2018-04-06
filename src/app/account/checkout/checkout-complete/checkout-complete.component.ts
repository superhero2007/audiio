import { Component, OnInit } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { CartService } from '../../../cart/cart.service';
import { AuthService } from '../../../shared/auth/auth.service';
import {User} from '../../../shared/user/user';
import {GoogleAnalyticsEventsService} from "../../../shared/google-analytics-events.service";

@Component({
  selector: 'app-checkout-complete',
  templateUrl: './checkout-complete.component.html',
  styleUrls: ['../../../shared/styles/hero.scss', './checkout-complete.component.scss', '../../../shared/styles/mobile.scss']
})
export class CheckoutCompleteComponent implements OnInit {

  charge:any;
  customer:any;
  track:any;
  user:User;

  expiration_date:any;
  contract:any;
  download:any;

  constructor(
    private cartService:CartService,
    private authService:AuthService,
    private googleAnalyticsEventsService:GoogleAnalyticsEventsService

  ) { }

  ngOnInit() {
    this.googleAnalyticsEventsService.pageview('checkout/complete');

    this.user = this.authService.getUserSource();
    this.customer = this.cartService.getLicenseSource().data.customer
    this.charge = this.cartService.getLicenseSource().data.charge;
    this.track = this.cartService.getCartSource()[0];
    this.track.license = this.user.license[this.user.license.length-1];

  }

}
