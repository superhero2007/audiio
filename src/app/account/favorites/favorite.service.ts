import {Injectable, EventEmitter} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import {User} from '../../shared/user/user';
import {AuthService} from '../../shared/auth/auth.service';


@Injectable()
export class FavoriteService {

  favoriteSource;
  favoriteSourceUpdated = new EventEmitter<User>();
  favoriteRemoveUpdate = new EventEmitter<User>();

  constructor(
    private http: Http,
    private authService:AuthService,
  ) { }

  addFavorites(track:any):Observable<any>{
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let accountID = this.authService.getUserSource();
    if(accountID != undefined){
      accountID = accountID.id;
    }

    let body = {
      "track_id":track.id,
      "account_id": accountID
    }

    return this.http
    .post(environment.api.url + environment.api.favorite, JSON.stringify(body), {headers: headers})
    .map((response: Response) => {
      if(localStorage.getItem('auth') !== null){
        let store = localStorage.getItem('auth');
        //this.authService.updateFavorites();
        this.favoriteSource = response.json().data.favorites;
        this.favoriteSourceUpdated.emit(this.favoriteSource);

        store = JSON.parse(store);
        store['favorites'] = response.json().data.favorites;
        this.authService.setUserSource(store);
      }
      return response.json().data
    })
    .catch(this.handleError);
  }

  removeFavorites(track:any):Observable<any>{
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let accountID = this.authService.getUserSource();
    if(accountID != undefined){
      accountID = accountID.id;
    }

    let body = {
      "track_id":track.id,
      "account_id": accountID
    }

    this.removeFavorateById(track.id);

    return this.http.delete(environment.api.url + environment.api.favorite + '/' + track.id + '/' + accountID, {headers: headers});

  }

  removeFavorateById(id){
    let user = this.authService.getUserSource();
    if(user !== undefined) {
      let fav = user['favorites'].map(x => x.track_id).indexOf(id);
      user['favorites'].splice(fav, 1);
      this.favoriteRemoveUpdate.emit(id);
      this.favoriteSourceUpdated.emit(user['favorites']);
      this.authService.setUserSource(user);
    }
  }
  getFavoriteById(id):boolean{ //: Observable<any> {
    let user = this.authService.getUserSource();
    let match:boolean = false;

    if(user !== undefined ) {
      if(user['favorites'] !== null){
        if(user['favorites'] !== undefined){
          user['favorites'].find((favorite)=>{
            if(favorite.track_id == id){
              match = true;
            }
          })
        }
      }
    }
    return match;

    /*return this.http.get(environment.api.url + environment.api.favorite + id + user.id)
     .map((resp: Response) => {

     return resp.json().data
     })
     .catch(this.handleError);*/
  }

  handleError(error: any) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
