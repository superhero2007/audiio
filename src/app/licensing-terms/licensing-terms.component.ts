import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-licensing-terms',
  templateUrl: './licensing-terms.component.html',
  styleUrls: ['./licensing-terms.component.css']
})
export class LicensingTermsComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Audiio - Terms');
  }

}
