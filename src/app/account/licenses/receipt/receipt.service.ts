import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ReceiptService {

  private receiptSource:any=[];
  receiptSourceUpdated = new EventEmitter<any>();

  constructor() { }

  getReceiptSource(): any {
    return this.receiptSource;
  }

  setReceiptSource(receipt:any){
    this.receiptSource = receipt;
    this.receiptSourceUpdated.emit(receipt);
  }

}