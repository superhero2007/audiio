import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class DialogService {

  isOpen:boolean = false;
  dialogUpdated = new EventEmitter<any>();

  constructor() { }

  setIsOpen(b:boolean){
    this.isOpen = b;
    this.dialogUpdated.emit(this.isOpen);
  }
  getIsOpen(){
    return this.isOpen;
  }

}
