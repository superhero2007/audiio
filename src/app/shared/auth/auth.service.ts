import {Injectable, EventEmitter} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {environment} from '../../../environments/environment';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { User } from '../user/user';

@Injectable()
export class AuthService {

  private url: string = 'api/';
  isAuthenticated = false;
  userUpdated = new EventEmitter<User>();
  userSource;
  error;
  remember:boolean = false;
  userSourceUpdated = new EventEmitter<User>();

  constructor(private http: Http) {

  }


  setUserSource(userSource: User) {

    if(localStorage.getItem('auth') !== null){
      localStorage.setItem('auth', JSON.stringify(userSource));
    }
    this.userSource = userSource;
    this.userSourceUpdated.emit(userSource);
  }

  getUserSource(): User {

    if(localStorage.getItem('auth') !== null){
      let store = localStorage.getItem('auth');
      store = JSON.parse(store);
      this.userSource = store;
      this.isAuthenticated = true;
      this.setUserSource(this.userSource);
    }

    return this.userSource;
  }

  /*getUser(): Observable<User> {
    return this.http.get(this.url + 'user.json')
    .map((resp: Response) => resp.json())
    .catch(this.handleError);
  }

  }*/
  passwordReset(form:any){
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let body = {
      "token":form.value.token,
      "password":form.value.password,
      "email":form.value.email
    }
    this.remember = form.value.remember;

    return this.http
    .post(environment.api.url + environment.api.resetPassword, JSON.stringify(body), {headers: headers})
    .map((response: Response) => {
      this.isAuthenticated = true;
      this.setUserSource(response.json().data);
      if(form.value.remember) {
        localStorage.setItem('auth', JSON.stringify(response.json().data));
      } else {
        this.authRemoveLocal();
      }
      return response.json().data
    })
    .catch(this.handleError);
  }
  getIsAuthenticated(form:any){
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let body = {
      "password":form.value.password,
      "email":form.value.email
    }
    this.remember = form.value.remember;

    return this.http
    .post(environment.api.url + environment.api.login, JSON.stringify(body), {headers: headers})
    .map((response: Response) => {

      this.isAuthenticated = true;
      this.setUserSource(response.json().data);
      if(form.value.remember) {
        localStorage.setItem('auth', JSON.stringify(response.json().data));
      } else {

        this.authRemoveLocal();
      }
      return response.json().data
    })
    .catch(this.handleError);
  }

  logout(){
    this.authRemoveLocal();
    this.isAuthenticated = false;
    this.setUserSource(null);
    this.userSourceUpdated.emit(this.getUserSource());

  }

  authRemoveLocal(){
    localStorage.removeItem('auth');
  }
  authStoreLocal(data){
    localStorage.setItem('auth', JSON.stringify(data) );
  }


  create(user:User) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.remember = user['remember'];
    return this.http
    .post(environment.api.url + environment.api.accountCreate, JSON.stringify(user), {headers: headers})
    .map((response: Response) => {
      this.isAuthenticated = true;
      this.setUserSource(response.json().data);
      this.userSourceUpdated.emit(this.getUserSource());

      if(this.remember){
        this.authStoreLocal(response.json().data);
      } else {
        this.authRemoveLocal();
      }


      return response.json().data
    })
    .catch(this.handleError);
  }

  invite(invite) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http
    .post(environment.api.url + environment.api.accountInvite, JSON.stringify(invite), {headers: headers})
    .map((response: Response) => {
      return response.json().data
    })
    .catch(this.handleError);
  }

  forgotPassword(form) {
    let email = {'email':form.get('email').value };
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http
    .post(environment.api.url + environment.api.forgotPassword, JSON.stringify(email), {headers: headers})
    .map((response: Response) => {
      return response.json().data
    })
    .catch(this.handleError);
  }

  update(user:User) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http
    .post(environment.api.url + environment.api.accountUpdate, JSON.stringify(user), {headers: headers})
    .map((response: Response) => {
      this.isAuthenticated = true;

      //this.setUserSource(response.json().data);
      this.userSourceUpdated.emit(this.getUserSource());

      return response.json().data
    })
    .catch(this.handleError);
  }


  handleError(error: any) {
    this.error = error.json().data;
    console.error(error);
    return Observable.throw(error.json().error || this.error);
  }
}
