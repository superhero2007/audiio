import {Injectable} from "@angular/core";
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';

declare let ga:Function;

@Injectable()
export class GoogleAnalyticsEventsService {

  constructor(
    private router:Router
  ){

  }
  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }

  public pageview(page){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        ga('set', 'page', event['url']);
        ga('send', 'pageview');
      }
    });
  }
}