import { Component, OnInit } from '@angular/core';
import { ReceiptService } from './receipt.service';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthService } from '../../../shared/auth/auth.service';
import {User} from '../../../shared/user/user';
import { Subscription }       from 'rxjs/Subscription';
import { TrackService } from '../../../shared/track/track.service';
import {environment} from '../../../../environments/environment';
import {GoogleAnalyticsEventsService} from "../../../shared/google-analytics-events.service";

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss', '../../account.scss']
})
export class ReceiptComponent implements OnInit {

  track:any;
  user:User;
  sub:Subscription;
  receipt:any;
  track_thumb:string = '';

  constructor(
    private receiptService:ReceiptService,
    private router:Router,
    private route:ActivatedRoute,
    private authService:AuthService,
    private trackService:TrackService,
    private googleAnalyticsEventsService:GoogleAnalyticsEventsService

  ) { }

  ngOnInit() {
    this.googleAnalyticsEventsService.pageview('receipt');

    this.track = this.receiptService.getReceiptSource();
    this.user = this.authService.getUserSource();

    //if(!this.track.hasOwnProperty('license')){
      this.user = this.authService.getUserSource();
      this.sub = this.route.params.subscribe(
        params => {
          if(this.user.hasOwnProperty('license')){
            this.user.license.filter((receipt)=>{
              if(receipt.order_number == params.id){
                this.receipt = receipt;
                this.trackService.getTrackById(receipt.track_id).subscribe((track)=>{
                  this.track = track[0];

                  this.track_thumb = environment.media.thumbs+this.track.album.image;
                  // this.router.navigate(['/account/licenses/']);
                });
              }
            })
          }
        });
    /*} else {

    }*/
    this.track_thumb = environment.media.thumbs+this.track.album.image;

  }

}
