import {Component, OnInit, NgZone, AfterViewInit} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';
import {MdDialog, MdSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CartService} from '../../cart/cart.service';
import {AuthService} from '../../shared/auth/auth.service';
import {User} from '../../shared/user/user';
import {environment} from '../../../environments/environment';
import {GoogleAnalyticsEventsService} from '../../shared/google-analytics-events.service';
import { MdDialogRef } from '@angular/material';
import {DialogService} from '../dialog.service';


@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['../../login/login.component.css', './custom-form.component.scss', '../styles/mobile.scss']
})
export class CustomFormComponent implements OnInit {
  custom: FormGroup;
  user: User;
  sending: boolean;
  errors: any[];


  constructor(private cartService: CartService,
              private authService: AuthService,
              public dialog: MdDialog,
              private http: Http,
              private router: Router,
              private fb: FormBuilder,
              private dialogService:DialogService,
              public dialogRef: MdDialogRef<CustomFormComponent>,
              private googleAnalyticsEventsService: GoogleAnalyticsEventsService) {}


  ngOnInit() {

    this.custom = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      client: ['', Validators.required],
      term: ['', Validators.required],
      budget: ['', Validators.required],
      details: ['', Validators.required],
      license: ['', Validators.required],
      project: '',
      distribution: '',
      amount: '',
      track: this.cartService.getCartSource()[0]
    })

    this.authService.userSourceUpdated.subscribe(
      (data: User) => {
        if (data != null) {
          this.user = data;
          this.custom = this.fb.group({
            first_name: [this.user.first_name, Validators.required],
            last_name: [this.user.last_name, Validators.required],
            email: [this.user.email, Validators.required],
            phone: [this.user.phone, Validators.required],
            client: [this.user.client, Validators.required],
            term: [this.user.term, Validators.required],
            budget: [this.user.budget, Validators.required],
            details: [this.user.details, Validators.required],
            license: [this.user.license, Validators.required],
            project: '',
            distribution: '',
            amount: '',
            track: this.cartService.getCartSource()[0]
          });
        }
      }
    );
  }

  onSubmitCustomForm() {
    this.sending = true;
    this.errors = [];
    const body = {
      'firstName': this.custom.get('first_name').value,
      'lastName': this.custom.get('last_name').value,
      'client': this.custom.get('client').value,
      'term': this.custom.get('term').value,
      'budget': this.custom.get('budget').value,
      'details': this.custom.get('details').value,
      'phone': this.custom.get('phone').value,
      'email': this.custom.get('email').value,
      // 'project': this.project['label'],
      // 'distribution': this.distribution['name'],
      // 'amount': this.amount,
      'track': this.cartService.getCartSource()[0]
    };

    if (
      this.custom.get('first_name').value == '' || this.custom.get('first_name').value == null ||
      this.custom.get('last_name').value == '' || this.custom.get('last_name').value == null ||
      this.custom.get('client').value == '' || this.custom.get('client').value == null ||
      this.custom.get('term').value == '' || this.custom.get('term').value == null ||
      this.custom.get('budget').value == '' || this.custom.get('budget').value == null ||
      this.custom.get('details').value == '' || this.custom.get('details').value == null ||
      this.custom.get('phone').value == '' || this.custom.get('phone').value == null ||
      this.custom.get('email').value == '' || this.custom.get('email').value == null
    ) {
      this.sending = false;
      this.errors.push('Please fill out your information');
    } else {
      this.submitCustomForm(body).subscribe();
    }

  }

  submitCustomForm(body) {

    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.api.url + environment.api.custom, JSON.stringify(body), {headers: headers}).map((response: Response) => {
      if (window.hasOwnProperty('google_trackConversion')) {
        // custom license
        window['google_trackConversion']({
          google_conversion_id: 845421511,
          google_conversion_language: 'en',
          google_conversion_format: '3',
          google_conversion_color: 'ffffff',
          google_conversion_label: '-nxPCKqqnXMQx7eQkwM',
          google_conversion_value: 0,
          google_remarketing_only: false
        });
      }
      this.router.navigate(['account/checkout/custom']);
      return response.json().data
    }).catch(this.handleError);
  }
  onClose(){
    this.dialog.closeAll();
    this.dialogService.setIsOpen(false);
  }

  handleError(error: any) {
    this.sending = false;
    this.errors.push("Please enter a vaid form of payment");
    return Observable.throw(error.json().error || 'Server error');
  }
}
