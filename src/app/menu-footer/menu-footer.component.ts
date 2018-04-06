import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-menu-footer',
  templateUrl: './menu-footer.component.html',
  styleUrls: ['./menu-footer.component.scss', '../shared/styles/mobile.scss']
})
export class MenuFooterComponent implements OnInit {

  year;
  version;
  constructor() { }

  ngOnInit() {
    this.year = new Date().getFullYear()
    this.version = environment.version;
  }

}
