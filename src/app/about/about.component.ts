import {Component, OnInit, NgZone} from '@angular/core';
import {GoogleAnalyticsEventsService} from '../shared/google-analytics-events.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  height;
  width;
  slideshowHeight;

  constructor(private ngZone: NgZone,
              private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
              private titleService: Title) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.slideshowHeight = this.height - 250;
      });
    };

  }

  ngOnInit() {
    this.googleAnalyticsEventsService.pageview('about');
    this.slideshowHeight = window.innerHeight - 250;
    this.titleService.setTitle('Audiio - About');

  }


}
