import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CartComponent implements OnInit {

  tracks: any;

  constructor(private cartService:CartService) { }

  ngOnInit() {
    if(this.cartService.getCartSource() !== undefined){
      this.tracks = this.cartService.getCartSource();
    } else {
      this.cartService.cartSourceUpdated.subscribe(
        (tracks) => {
          this.tracks = tracks;
        }
      );
    }
  }

  sendPayment(){
  }

}
