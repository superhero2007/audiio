import {Component, OnInit, NgZone, Injectable, EventEmitter, OnDestroy, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {formBounce} from '../shared/app.page-animations';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {GoogleAnalyticsEventsService} from '../shared/google-analytics-events.service';
import {Title} from '@angular/platform-browser';


import {User} from '../shared/user/user';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss', '../shared/styles/mobile.scss']
})
export class ContactComponent implements OnInit, OnDestroy, AfterViewInit {

  isSent: boolean = false;
  height;
  width;
  slideshowHeight;
  error: string;
  form: FormGroup;

  message = {
    id: 'message',
    text: null,
    placeholder: 'Share the details...',
    classes: '',
    required: false,
    inputValue: null
  };

  email = {
    id: 'email',
    text: null,
    placeholder: 'Email Address',
    classes: '',
    required: false,
    inputValue: null
  };

  phone = {
    id: 'phone',
    text: null,
    placeholder: 'Phone Number',
    classes: '',
    required: false,
    inputValue: null
  };

  firstName = {
    id: 'firstName',
    text: null,
    placeholder: 'First Name',
    classes: '',
    required: false,
    inputValue: null
  };

  lastName = {
    id: 'lastName',
    text: null,
    placeholder: 'Last Name',
    classes: '',
    required: false,
    inputValue: null
  };

  interests = [
    {title: 'I need help with my music search', name: 'music-search-help'},
    {title: 'I want to work at Audiio', name: 'job-at-audiio'},
    {title: 'I want my music on Audiio', name: 'artist-on-audiio'},
    {title: 'I have a licensing question', name: 'question-licensing'}
  ]

  constructor(ngZone: NgZone,
              private fb: FormBuilder,
              private http: Http,
              private titleService: Title,
              private googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.slideshowHeight = this.height - 300;
      });
    };

  }

  ngOnInit() {
    this.googleAnalyticsEventsService.pageview('contact');

    this.form = this.fb.group({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      interest: '',
      message: ''
    })

    this.slideshowHeight = window.innerHeight - 300;
    this.titleService.setTitle('Audiio - Contact');
  }

  submitForm(form: any): void {
    this.error = '';
    if (
      form.get('firstName').value == '' ||
      form.get('lastName').value == '' ||
      form.get('email').value == '' ||
      form.get('interest').value == ''
    ) {
      this.error = 'Please enter the information'
    }
    if (this.error == '' || this.error == null) {
      this.sendContact(form).subscribe();
    }
  }

  sendContact(form: any) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let body = {
      "firstName": form.value.firstName,
      "lastName": form.value.lastName,
      "interest": form.value.interest.name,
      "phone": form.value.phone,
      "message": form.value.message,
      "email": form.value.email
    }

    return this.http.post(environment.api.url + environment.api.contact, JSON.stringify(body), {headers: headers}).map((response: Response) => {
      this.isSent = true;
      return response.json().data
    }).catch(this.handleError);
  }

  handleError(error: any) {
    this.error = error.json().data;
    console.error(error);
    return Observable.throw(error.json().error || this.error);
  }

  ngOnDestroy() {
    document.querySelectorAll('.contact')[0]['style']['color'] = 'black';
    document.querySelectorAll('.contact')[0]['style']['background'] = 'white';
  }

  ngAfterViewInit() {
    document.querySelectorAll('.contact')[0]['style']['color'] = 'white';
    document.querySelectorAll('.contact')[0]['style']['background'] = 'black';
  }

}
