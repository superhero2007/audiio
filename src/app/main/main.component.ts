import {Component, OnInit, NgZone, Input, ViewEncapsulation, AfterViewInit, OnDestroy, HostListener} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ScrollSpyModule, ScrollSpyService} from 'ngx-scrollspy';

declare var $: any;


//import {trigger, state, style, transition, animate, keyframes} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss', '../shared/styles/mobile.scss'],
  /*animations:[
    trigger('slide',[
      state('slide1', style({
        transform:'translateY(0)',
      })),
      state('slide2', style({
        transform:'translateY(-100%)',
      })),
      state('slide3', style({
        transform:'translateY(-200%)',
      })),
      transition('slide1 => slide2', animate('3s ease-out')),
      transition('slide1 => slide3', animate('3s ease-out')),
      transition('slide2 => slide1', animate('3s ease-out')),
      transition('slide2 => slide3', animate('3s ease-out')),
      transition('slide3 => slide2', animate('3s ease-out')),
      transition('slide3 => slide1', animate('3s ease-out'))
    ]),

  ]*/
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

  state: string = 'slide1';
  slideshowHeight;
  posControls: any = '15%';
  slideshowHeightFull;
  width;
  height;

  constructor(ngZone: NgZone,
              private titleService: Title,
              private scrollSpyService: ScrollSpyService) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.slideshowHeight = this.height - 90;
        this.slideshowHeightFull = this.height;
      });
    };

  }

  ngOnDestroy() {
    document.getElementById('spyHomeSlides').style.display = 'none';
    document.querySelectorAll('app-menu-main')[0]['style']['position']='absolute';
    document.querySelectorAll('.logo')[0]['style']['color'] = 'black';
    document.querySelectorAll('.menu-bar')[0]['style']['background'] = 'white';
    document.querySelectorAll('.menu-bar')[0]['style']['border'] = '0';
    document.querySelectorAll('.newMusic')[0]['style']['color'] = 'black';
    document.querySelectorAll('.newMusic')[0]['style']['background'] = 'white';
    document.querySelectorAll('.icon-menu')[0]['style']['background-image'] = 'url(/assets/image/icon-menu.png)';
    let loginButton = document.querySelectorAll('.loginButton')
    if (loginButton.length > 1) {
      loginButton[0]['style']['color'] = 'black';
      loginButton[1]['style']['color'] = 'black';
      document.querySelectorAll('.separator')[0]['style']['border-right-color'] = 'black';
    }
  }

  ngAfterViewInit() {
    this.scrollSpyService.getObservable('slideshow').subscribe((e: any) => {
      //console.log('ScrollSpy::slideshow: ', e);
    });
    document.getElementById('spyHomeSlides').style.display = 'block';
    document.querySelectorAll('app-menu-main')[0]['style']['position']='fixed';
    document.querySelectorAll('.logo')[0]['style']['color'] = 'white';
    this.goToSlide('artist-slide-1', null);
    document.querySelectorAll('.icon-menu')[0]['style']['background-image'] = 'url(/assets/image/icon-menu-white.png)';
    console.log(document.querySelectorAll('.icon-menu')[0]['style']);
    let loginButton = document.querySelectorAll('.loginButton')
    if (loginButton.length > 1) {
      loginButton[0]['style']['color'] = 'white';
      loginButton[1]['style']['color'] = 'white';
      document.querySelectorAll('.separator')[0]['style']['border-right-color'] = 'white';
    }
  }

  ngOnInit() {
    this.slideshowHeight = window.innerHeight - 90;
    this.slideshowHeightFull = window.innerHeight;
    this.titleService.setTitle('Audiio');
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.pageYOffset > this.slideshowHeightFull * 2) {
      document.querySelectorAll('.logo')[0]['style']['color'] = 'black';
      document.querySelectorAll('.menu-bar')[0]['style']['background'] = 'transparent';
      document.querySelectorAll('.menu-bar')[0]['style']['border'] = '0.5px solid #b0b0b0';
      let loginButton = document.querySelectorAll('.loginButton')
      if (loginButton.length > 1) {
        loginButton[0]['style']['color'] = 'black';
        loginButton[1]['style']['color'] = 'black';
        document.querySelectorAll('.separator')[0]['style']['border-right-color'] = 'black';
      }
    }
    else {
      document.querySelectorAll('.logo')[0]['style']['color'] = 'white';
      document.querySelectorAll('.menu-bar')[0]['style']['background'] = 'white';
      document.querySelectorAll('.menu-bar')[0]['style']['border'] = '0';
      let loginButton = document.querySelectorAll('.loginButton')
      if (loginButton.length > 1) {
        loginButton[0]['style']['color'] = 'white';
        loginButton[1]['style']['color'] = 'white';
        document.querySelectorAll('.separator')[0]['style']['border-right-color'] = 'white';
      }
    }
    if (window.pageYOffset > this.slideshowHeightFull * 1.5) {
      document.querySelectorAll('.controls li a')[0]['style']['background-color'] = 'black';
      document.querySelectorAll('.controls li a')[1]['style']['background-color'] = 'black';
      document.querySelectorAll('.controls li a')[2]['style']['background-color'] = '#aaa';
    }
    else if (window.pageYOffset > this.slideshowHeightFull * 0.5) {
      document.querySelectorAll('.controls li a')[0]['style']['background-color'] = '#aaa';
      document.querySelectorAll('.controls li a')[1]['style']['background-color'] = 'white';
      document.querySelectorAll('.controls li a')[2]['style']['background-color'] = '#aaa';
    }
    else {
      document.querySelectorAll('.controls li a')[0]['style']['background-color'] = 'white';
      document.querySelectorAll('.controls li a')[1]['style']['background-color'] = '#aaa';
      document.querySelectorAll('.controls li a')[2]['style']['background-color'] = '#aaa';
    }

    if (window.pageYOffset <= this.slideshowHeightFull * 2 && window.pageYOffset >= this.slideshowHeightFull - 20) {
      document.querySelectorAll('.newMusic')[0]['style']['color'] = 'white';
      document.querySelectorAll('.newMusic')[0]['style']['background'] = 'black';
    }
    else {
      document.querySelectorAll('.newMusic')[0]['style']['color'] = 'black';
      document.querySelectorAll('.newMusic')[0]['style']['background'] = 'white';
    }
  }

  /*goToSlide(_slide, e) {

    let everyChild = document.querySelectorAll('#section2 .artists-slide');
    const slide = document.getElementById(_slide);
    slide.style.zIndex = '0';
    slide.style.top = '0px';
    slide.style.transitionDuration = '0s';
    for (let i = 0; i < everyChild.length; i++) {
      if (everyChild[i]['id'] !== slide.id) {
        everyChild[i]['style']['transition-duration'] = '1s';
        everyChild[i]['style']['top'] = '-' + ( everyChild[i].clientHeight + 100 ) + 'px';
        everyChild[i]['style']['z-index'] = '1';
      }
    }

    if (e !== null) {
      everyChild = document.querySelectorAll('.menu-secondary li');
      for (let i = 0; i < everyChild.length; i++) {
        everyChild[i].classList.remove('active');
      }

      e.currentTarget.parentElement.classList.add('active');
    }

  }*/
  goToSlide(_slide, e) {
    let everyChild = document.querySelectorAll('.article-container .artists-slide');
    everyChild[0]['style']['z-index'] = '0';
    everyChild[1]['style']['z-index'] = '0';
    everyChild[2]['style']['z-index'] = '0';
    everyChild = document.querySelectorAll('.article-container .active');
    const slide = document.getElementById(_slide);
    if (everyChild.length && everyChild[0]['id'] !== slide.id) {
      everyChild[0]['style']['z-index'] = '1';
      everyChild[0].classList.remove('active');
    }
    slide.style.zIndex = '2';
    slide.style.top = '0';
    slide.classList.add('active');


    if (e !== null) {
      everyChild = document.querySelectorAll('.menu-secondary li');
      for (let i = 0; i < everyChild.length; i++) {
        everyChild[i].classList.remove('preactive');
        if (e.currentTarget.parentElement!= everyChild[i] && everyChild[i].classList.contains('active'))
        {
          everyChild[i].classList.remove('active');
          everyChild[i].classList.add('preactive');
        }
      }

      e.currentTarget.parentElement.classList.add('active');
    }

  }

  scrollTo(section) {

    const sliders = document.getElementById('sliders');
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    const section3 = document.getElementById('section3');
    sliders.style.transition = 'top 5s ease-out';
    section1.style.transition = 'top 5s ease-out';
    section2.style.transition = 'top 5s ease-out';
    section3.style.transition = 'top 5s ease-out';


    let pos2 = this.slideshowHeightFull;
    let pos3 = this.slideshowHeightFull * 2;

    switch (section) {
      case 1:
        window.scrollTo(0, 0);
        this.posControls = '15%';
        break;
      case 2:
        window.scrollTo(0, this.slideshowHeightFull);
        this.posControls = '50%';
        //sliders.style.top = "-" + pos2.toString() + "px";
        break;
      case 3:
        window.scrollTo(0, this.slideshowHeightFull * 2);
        this.posControls = '82%'
        break;
    }


  }


}
