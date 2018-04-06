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
import {LoadingComponent} from '../../shared/loading/loading.component';
import {LoginComponent} from '../../login/login.component';
import {SignUpComponent} from '../../sign-up/sign-up.component';
import {CustomFormComponent} from '../../shared/custom-form/custom-form.component';
import {User} from '../../shared/user/user';
import {environment} from '../../../environments/environment';
import {GoogleAnalyticsEventsService} from '../../shared/google-analytics-events.service';

declare var Stripe: any;
declare var paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['../../shared/styles/hero.scss', './checkout.component.scss', '../../shared/styles/mobile.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit {

  paymentTypeCredit: boolean = true;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  name: string = 'testing...';
  description: string = 'i am testing payments.';
  amount: string = '0.02';
  isInstant: boolean;
  showCustomForm: boolean = false;
  isLoggedIn: boolean = false;
  projectEle;
  audienceEle;
  paymentEle;
  audienceSizePositionY;
  projectTypePosition;
  paymentPosition;
  posYPadding = 30;
  remember: boolean = false;
  password: string;
  message: string;
  track_thumb: string;
  tracks;
  form: FormGroup;
  custom: FormGroup;
  user: User;
  errors: any[];
  project: string;
  needsPayment: boolean;
  sending: boolean;
  readyToPurchase: boolean = false;
  projectSelected: boolean = false;
  distributionSelected: boolean = false;
  coupon_code: string;
  coupon_info: string;
  payment_amount: any;
  checkoutSelected: boolean = true;

  projectType = [
    {'label': 'Personal Project', 'name': 'personal', 'amount': 49},
    {'label': 'Indie / Featured Film', 'name': 'independent'},
    {'label': 'Advertising / Corporate', 'name': 'advertising'},
    {'label': 'Nonprofit Organization', 'name': 'nonprofit'},
    {'label': 'Wedding', 'name': 'wedding', 'amount': 49},
    {'label': 'Other / Custom License', 'name': 'custom'}
  ];
  distributionType = [
    {'label': 'Internet', 'name': 'internet', checked: true},
    {'label': 'Premium Streaming Service', 'name': 'premium', checked: false},
    {'label': 'Television Broadcast', 'name': 'television', checked: false},
    {'label': 'DVD / Blueray', 'name': 'dvd', checked: false},
    {'label': 'Event or In-Store', 'name': 'event', checked: false},
    {'label': 'Other / Custom License', 'name': 'custom', checked: false}
  ];
  distributions: any[] = [];
  distribution: string;
  stripe = Stripe('pk_live_rompHNJ5xbs5ElCFc8CAcIKr');
  // stripe = Stripe('pk_test_SpCo3RFVep03nn2f09U1Il2w');
  elements;
  card;
  token = {};
  posY: number = 50;
  posYOptions: number = 0;

  constructor(private cartService: CartService,
              private authService: AuthService,
              public dialog: MdDialog,
              private http: Http,
              private router: Router,
              private fb: FormBuilder,
              private googleAnalyticsEventsService: GoogleAnalyticsEventsService) {}

  ngOnInit() {

    this.googleAnalyticsEventsService.pageview('checkout');

    this.needsPayment = false;

    this.authService.userSourceUpdated.subscribe(
      (data: User) => {
        if (data != null) {
          this.user = data;

          this.isLoggedIn = true;
          this.form = this.fb.group({
            first_name: [this.user.first_name, Validators.required],
            last_name: [this.user.last_name, Validators.required],
            email: [this.user.email, Validators.required],
            address: [this.user.address, Validators.required],
            city: [this.user.city, Validators.required],
            state: [this.user.state, Validators.required],
            postal_code: [this.user.postal_code, Validators.required],
            remember: [this.remember],
            password: [this.password]
          })
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
          })
        } else {
          this.isLoggedIn = false;
        }
      }
    );

    this.user = this.authService.getUserSource();

    if (this.user !== undefined) {
      this.form = this.fb.group({
        first_name: [this.user.first_name, Validators.required],
        last_name: [this.user.last_name, Validators.required],
        email: [this.user.email, Validators.required],
        address: [this.user.address, Validators.required],
        city: [this.user.city, Validators.required],
        state: [this.user.state, Validators.required],
        postal_code: [this.user.postal_code, Validators.required],
        remember: [this.remember],
        password: [this.password],

      })
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
      })
    } else {
      this.form = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postal_code: ['', Validators.required],
        remember: [this.remember],
        password: [this.password]
      })
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
    }
    if (this.cartService.getCartSource() !== undefined) {
      this.tracks = this.cartService.getCartSource()[0];

      if (this.tracks == undefined) {
        this.router.navigate(['/browse']);
      } else {
        this.isInstant = (this.tracks.artist.license === 1) ? true : false;
      }
    } else {
      this.cartService.cartSourceUpdated.subscribe(
        (tracks) => {
          this.tracks = tracks[0];
          this.isInstant = (tracks[0]['artist']['license'] === 1) ? true : false;

        }
      );
    }

    if (this.tracks != undefined) {
      if (this.tracks.hasOwnProperty('album')) {
        if (this.tracks.album !== undefined) {
          if (this.tracks.album.image.length > 1) {
            this.track_thumb = environment.media.thumbs + this.tracks.album.image;
          }
        }
      }
    }
  }

  ngAfterViewInit() {

    this.projectEle = document.getElementById('project');
    this.audienceEle = document.getElementById('audience');
    this.paymentEle = document.getElementById('payment');

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card', {
      base: {
        '::placeholder': {
          color: '#aab7c4'
        }
      }
    });
    this.card.mount(document.getElementById('card-element'));


  }

  onSubmitForm(e) {
    this.getToken();
  }

  getToken() {

    this.sending = true;
    this.message = 'Loading...';
    this.errors = [];
    let promise = this.stripe.createToken(this.card);
    /*if(this.user == undefined){
     this.errors.push('Enter email');
     }*/
    if (this.tracks == undefined) {
      this.errors.push('Select a track.');
    }
    if (
      this.form.get('first_name').value == '' ||
      this.form.get('last_name').value == '' ||
      this.form.get('email').value == '' ||
      this.form.get('address').value == '' ||
      this.form.get('city').value == '' ||
      this.form.get('state').value == '' ||
      this.form.get('postal_code').value == ''
    ) {
      this.errors.push('Enter your information');
    }
    if (this.errors.length <= 0) {
      promise.then(
        (result) => {
          if (result.hasOwnProperty('error')) {
            this.sending = false;
          } else {
            this.postPayment(result).subscribe(
              (payment) => {

                if (payment.data.result == 'error') {
                  this.sending = false;
                  this.errors.push("Unable to complete payment.");
                } else {
                  this.sending = true;
                  this.user = this.authService.getUserSource();
                  this.user.license = payment.data.license;
                  this.authService.setUserSource(payment.data.user)
                  this.cartService.setLicenseSource(payment);
                  this.router.navigate(['account/checkout/complete']);
                }
              },
              (err) => {
              }
            );
          }
        });
    }
  }

  onLogin() {
    this.dialog.open(LoginComponent);
  }

  onSignUp() {
    this.dialog.open(SignUpComponent);
  }

  postPayment(token) {
    this.sending = true;
    /// this.dialog.open(LoadingComponent);
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    if (this.user == undefined) {
      this.user = {};
    }
    this.user.first_name = this.form.get('first_name').value;
    this.user.last_name = this.form.get('last_name').value;
    this.user.email = this.form.get('email').value;
    this.user.address = this.form.get('address').value;
    this.user.city = this.form.get('city').value;
    this.user.state = this.form.get('state').value;
    this.user.postal_code = this.form.get('postal_code').value;
    this.remember = this.form.get('remember').value;

    //this.coupon_code = this.form.get('coupon_code').value;

    let body = token;

    body.license = this.distributionType;
    body.license_name = 'License:' + this.tracks.artist.name + " - " + this.tracks.title;
    body.license_description = 'Project:';
    body.license_amount = this.payment_amount * 100; // this.distribution['amount'] * 100;
    body.email = this.user.email;
    body.user = this.user;
    body.track = this.cartService.getCartSource()[0];
    body.track.thumb = environment.media.thumbs + this.tracks.album.image;
    body.track.download = environment.media.m4a + this.tracks.sound_pro;
    body.project = this.project['label'];
    body.distribution = this.distribution['name'];
    body.coupon_code = this.coupon_code;

    return this.http.post(environment.api.url + environment.api.payment, JSON.stringify(body), {headers: headers}).map((response: Response) => {

      if (window.hasOwnProperty('google_trackConversion')) {
        window['google_trackConversion']({
          // purchase license
          google_conversion_id: 845421511,
          google_conversion_language: 'en',
          google_conversion_format: '3',
          google_conversion_color: 'ffffff',
          google_conversion_label: 'Kgp6CMiJjHMQx7eQkwM',
          google_conversion_value: 0,
          google_remarketing_only: false
        });
      }

      return response.json()
    }).catch(this.handleError);
  }

  handleError(error: any) {
    this.sending = false;
    this.errors.push("Please enter a vaid form of payment");
    return Observable.throw(error.json().error || 'Server error');
  }

  onSelectPayPal() {
    const amount = this.amount;
    paypal.Button.render({
      env: 'sandbox', // sandbox | production
      style: {
        label: 'paypal',
        size: 'medium',    // small | medium | large | responsive
        shape: 'rect',     // pill | rect
        color: 'blue',     // gold | blue | silver | black
        tagline: false
      },
      client: {
        sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
        production: '<insert production client id>'
      },
      commit: true,
      payment: function (data, actions) {
        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: {total: amount, currency: 'USD'}
              }
            ]
          }
        });
      },
      onAuthorize: function (data, actions) {
        return actions.payment.execute().then(function () {
          window.alert('Payment Complete!');
        });
      }
    }, '#paypal-button-container');

  }



  onDistributionChange(e) {
    this.distributionType.filter((type) => {
      if (e.source.value.name === type.name) {
        e.source.value.checked = e.source.checked;
        if (e.source.checked) {
          this.distributions.push(e.source.value);
        } else {
          this.distributions = this.distributions.filter(function (obj) {
            return obj.name !== e.source.value.name;
          });
        }
      }
    });
    if (this.distributions.length > 0) {
      this.distribution = 'true';
    } else {
      this.distribution = null;
    }
  }

  checkCouponCode() {
    return this.http.get(environment.api.url + environment.api.coupon + '/' + this.coupon_code).map((resp: Response) => {
      resp = resp.json().data
      if (resp['result'] === 'error') {
        this.coupon_info = 'Dang! This promo code is not valid';
      }
      if (resp.hasOwnProperty('id')) {
        if (resp['valid']) {
          this.coupon_info = 'YES! This is a valid promo code. <br/>';
          this.coupon_info += resp['description'];
        } else {
          this.coupon_info = 'Dang! This promo code is not valid';
        }
      }
      return resp;
    }).catch((error: any) => {
      return Observable.throw(error.json().error || 'Server error');
    });
  }

  onCouponCode(e) {
    this.coupon_code = e.target.value;
    if (e.target.value.length > 0) {
      this.checkCouponCode().subscribe((content) => {
        if (content.hasOwnProperty('valid')) {
          if (content.valid) {
            const discount_amount = content.discount_amount;
            const discount_type = content.discount_type;
            if (discount_type === '%') {
              const discount_percent = (content.discount_amount / 100) * this.distribution['amount'];
              this.payment_amount = Math.abs(discount_percent - this.distribution['amount']);
            } else {
              this.payment_amount = Math.abs(content.discount_amount - this.distribution['amount']);
            }
            const pay = this.payment_amount.toFixed(2);
            this.payment_amount = String(pay);
          } else {
            this.payment_amount = this.distribution['amount'];
          }
        } else {
          this.payment_amount = this.distribution['amount'];
        }
      });
    } else {
      this.payment_amount = this.distribution['amount'];
      this.coupon_info = '';
    }
  }

  updateCheckoutForm() {

    if (!this.isInstant) {
      // this.showCustomForm = true;
      this.dialog.open(CustomFormComponent);
    }
    if (!this.isInstant && this.showCustomForm) {
      // this.showCustomForm = true;
      this.dialog.open(CustomFormComponent);
    } else if (this.isInstant && this.showCustomForm) {
      // this.showCustomForm = true;
      this.dialog.open(CustomFormComponent);
    }
  }

  onBackToDistribution(e) {

    this.payment_amount = undefined;
    this.needsPayment = false;


    if (this.project['name'] == 'personal' ||
      this.project['name'] == 'wedding' ||
      this.project['name'] == 'custom') {
      this.checkoutSelected = true;
      this.distributionSelected = false;
      this.projectSelected = false;
    } else {
      this.checkoutSelected = false;
      this.distributionSelected = false;
      this.projectSelected = true;
    }
  }

  resetDistribution() {
    this.distributionType.forEach((obj) => {
      obj.checked = false;
    });
  }

  onSelectProject(e) {

    this.distributions = [];
    this.distribution = null;
    this.distributions = [this.project];
    this.onSelectPayPal();
    this.resetDistribution();

    if(this.project['name'] === 'personal' || this.project['name'] == 'wedding') {
      this.projectSelected = false;
      this.amount = this.project['amount'];
      this.payment_amount = this.project['amount'];
      this.distributionSelected = true;
      this.checkoutSelected = false;
      this.needsPayment = true;
    } else if (this.project['name'] === 'custom') {

      this.dialog.open(CustomFormComponent);

    } else {
      this.checkoutSelected = false;
      this.projectSelected = true;
      this.amount = this.project['amount'];
      this.distributionSelected = true;
    }
  }

  onSelectDistribution(e) {

    const distributionsChecked = this.distributionType.filter((obj) => { return obj.checked == true });
    let other;

    this.checkoutSelected = false;
    this.projectSelected = false;
    this.distributionSelected = true;
    this.showCustomForm = false;

    switch (this.project['name']) {
      case 'independent':
        // if internet is selected
        if (distributionsChecked.length == 1 &&
          (distributionsChecked[0].name == 'internet' || distributionsChecked[0].name == 'event')) {
          this.payment_amount = '99';
          this.needsPayment = true;
        } else
        // if internet and event is selected
        if (distributionsChecked.length == 2) {
          other = this.distributions.filter((obj) => { return obj.name == 'internet' || obj.name == 'event' });
          if (other.length >= 1) {
            this.payment_amount = '199';
            this.needsPayment = true;
          } else {
            this.projectSelected = true;
            this.distributionSelected = false;
            // this.showCustomForm = true;
            this.dialog.open(CustomFormComponent);

          }
        } else {
          this.projectSelected = true;
          this.distributionSelected = false;
          // this.showCustomForm = true;
          this.dialog.open(CustomFormComponent);
        }

        break;
      case 'advertisment':
        if (distributionsChecked.length == 1 && distributionsChecked[0].name == 'internet') {
          this.payment_amount = '199';
          this.needsPayment = true;
        } else {
          // this.showCustomForm = true;
          this.projectSelected = true;
          this.distributionSelected = false;
          this.dialog.open(CustomFormComponent);
        }
        break;
      case 'nonprofit':
        if (distributionsChecked.length == 1 && distributionsChecked[0].name == 'internet') {
          this.payment_amount = '49';
          this.needsPayment = true;
        } else
        // if internet and event is selected
        if (distributionsChecked.length == 2) {
          other = this.distributionType.filter((obj) => { return obj.name == 'internet' || obj.name == 'event' });
          if (other.length >= 1) {
            this.payment_amount = '199';
            this.needsPayment = true;
          }
        } else {
          // this.showCustomForm = true;
          this.projectSelected = true;
          this.distributionSelected = false;
          this.dialog.open(CustomFormComponent);
        }
        break;
      case 'custom':
        this.amount = this.project['amount'];
        this.projectSelected = false;
        this.distributionSelected = true;
        this.distribution = null;
        this.needsPayment = true;
        this.payment_amount = this.project['amount'];
        this.distributions = [this.project];
        break;
    }
    if (this.project['name'] == 'custom' ||
      this.distributions.filter((obj) => { return obj.name == 'custom' }).length > 0) {
      // this.showCustomForm = true;
      this.projectSelected = true;
      this.distributionSelected = false;
      this.dialog.open(CustomFormComponent);

    }
    this.updateCheckoutForm();
  }

  onBackToProject(e) {
    this.distribution = null;

    if (this.project['name'] == 'personal' || this.project['name'] == 'custom' || this.project['name'] == 'wedding') {
      this.checkoutSelected = true;
      this.distributionSelected = false;
      this.projectSelected = false;
    } else {
      //this.distribution = null;
      this.checkoutSelected = true
      this.distributionSelected = false;
      this.projectSelected = false;
    }

  }


  onBack(e) {
    window.history.back();
  }


  onProjectChange(e) {
    // this.distribution = null;
    // this.projectTypePosition = (this.projectEle.offsetHeight + 20) * -1;
    // this.posYOptions = this.projectTypePosition;


  }
}