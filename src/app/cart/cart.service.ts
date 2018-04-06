import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class CartService {

  private cartSource:any=[];
  cartSourceUpdated = new EventEmitter<any>();
  private licenseSource:any=[];
  licenseSourceUpdated = new EventEmitter<any>();

  constructor() { }

  addCartSource(track:any){
    this.cartSource = [];
    this.cartSource.push(track);
    this.cartSourceUpdated.emit(track);
  }
  deleteCartSource(track:any){
    let tmp = this.cartSource.map(x => x.id).indexOf(track.id);
    this.cartSource.splice(tmp, 1);
    this.cartSourceUpdated.emit(track);
  }

  getCartSource(): any {
    return this.cartSource;
  }

  setLicenseSource(license:any){
    this.licenseSource = license;
    this.licenseSourceUpdated.emit(license);
  }
  getLicenseSource(): any {
    return this.licenseSource;
  }
}
