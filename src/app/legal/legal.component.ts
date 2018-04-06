import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent implements OnInit {

  content:string;

  constructor(
    private http: Http,
    private titleService: Title
  ) { }

  ngOnInit() {

    this.getPage().subscribe((content) => {
      this.content = content;
    });
    this.titleService.setTitle('Audiio - Legal');

  }

  getPage(){
    return this.http.get(environment.api.url + environment.api.legal)
    .map((resp: Response) => {
      this.content = resp.json().data;
      return this.content;
    })
    .catch(this.handleError);
  }
  handleError(error: any) {
    return Observable.throw(error.json().error || 'Server error');
  }

}
