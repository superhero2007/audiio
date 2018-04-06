import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';
import { formBounce} from '../shared/app.page-animations';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/user/user'

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth:AuthService
  ) { }

  ngOnInit() {
  }
  submitForm(value: any):void{
  }
  onShare(){

  }

}
