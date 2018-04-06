import {EventEmitter, HostListener, Component, Directive, Output} from '@angular/core';

@Directive({
  selector: '[track-scroll]',
  //host: {'(window:scroll)': 'track($event)'}
})

export class TrackScrollDirective {
  //@Output() pageYPositionChange:EventEmitter<any> = new EventEmitter();
  pageYPositionChange:EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  @HostListener('window:scroll', ['$event'])
  track(event:any) {
    this.pageYPositionChange.emit(document.body.scrollTop);
  }
}
