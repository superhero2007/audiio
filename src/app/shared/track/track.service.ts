import {Injectable, EventEmitter} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PlaylistsService} from '../../playlists/playlists.service';
import {AuthService} from '../auth/auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';
import {environment} from '../../../environments/environment';
import {User} from '../user/user';
import {FavoriteService} from '../../account/favorites/favorite.service';
import * as _ from 'underscore';

@Injectable()
export class TrackService {
  user: User;
  allTracks = [];
  allAlbums = [];
  allArtists = [];
  allPlaylists = [];
  favoritesUpdated = new EventEmitter<User>();
  favoritesSource;

  constructor(private http: Http,
              private playlistService: PlaylistsService,
              private authService: AuthService,
              private favoriteService: FavoriteService) {

  }


  getAllAlbums(): Observable<any> {

    if (localStorage.getItem('allAlbums') !== null) {
      return Observable.of(localStorage.getItem('allAlbums')).map(store => {
        let mylist: any = JSON.parse(store);
        this.allAlbums = mylist;
        this.playlistService.setAllAlbumsSource(mylist);
        return mylist;
      });
    }

    return this.http.get(environment.api.url + environment.api.album).map((resp: Response) => {
      this.allAlbums = resp.json().data;
      this.playlistService.setAllAlbumsSource(this.allAlbums);
      localStorage.setItem('allAlbums', JSON.stringify(resp.json().data));
      return resp.json().data
    }).catch(this.handleError);
  }

  getAllPlaylists(): Observable<any> {
    if (localStorage.getItem('allPlaylists') !== null) {
      return Observable.of(localStorage.getItem('allPlaylists')).map(store => {
        let mylist: any = JSON.parse(store);
        this.allPlaylists = mylist;
        this.playlistService.setAllPlaylistsSource(mylist);
        return mylist;
      });
    }

    return this.http.get(environment.api.url + environment.api.playlist).map((resp: Response) => {
      this.allPlaylists = resp.json().data;
      localStorage.setItem('allPlaylists', JSON.stringify(resp.json().data));
      this.playlistService.setAllPlaylistsSource(this.allPlaylists);
      return resp.json().data;
    }).catch(this.handleError);
  }

  getAllArtists(): Observable<any> {

    if (localStorage.getItem('allArtists') !== null) {
      return Observable.of(localStorage.getItem('allArtists')).map(store => {
        let mylist: any = JSON.parse(store);
        this.allArtists = mylist;
        this.playlistService.setAllArtistsSource(mylist);
        return mylist;
      });
    }

    return this.http.get(environment.api.url + environment.api.artist).map((resp: Response) => {
      this.allArtists = resp.json().data;
      this.playlistService.setAllArtistsSource(this.allArtists);
      localStorage.setItem('allArtists', JSON.stringify(resp.json().data));
      return resp.json().data
    }).catch(this.handleError);
  }

  getAllTracks(): Observable<any> {

    if (localStorage.getItem('allTracks') !== null) {
      return Observable.of(localStorage.getItem('allTracks')).map(store => {
        let mylist: any = JSON.parse(store);
        //mylist = this.uniq(mylist);
        this.allTracks = mylist;
        this.playlistService.setAllTracksSource(mylist);
        return mylist;
      });
    }

    return this.http.get(environment.api.url + environment.api.track).map((resp: Response) => {
      //this.allTracks = resp.json().data;

      let mylist: any = resp.json().data;
      let mylistLength = mylist.length;
      let myOrderedList = [];
      let myRemovalIndex = [];
      let i = 0;

      let currentIndex = mylist.length, temporaryValue, randomIndex;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = mylist[currentIndex];
        mylist[currentIndex] = mylist[randomIndex];
        mylist[randomIndex] = temporaryValue;

        if (mylist[currentIndex]['order_by'] > 0) {
          myOrderedList.push(mylist[currentIndex]);
          mylist.splice(currentIndex, 1);
        }
      }

      myOrderedList.sort(function(a, b) {
        return parseFloat(a.order_by) - parseFloat(b.order_by);
      });

      for (i; i < myOrderedList.length; i++) {
        if (myOrderedList[i]['order_by'] > 0) {
          mylist.splice(myOrderedList[i]['order_by'] - 1, 0, myOrderedList[i]);
        }
      }

      //mylist = myOrderedList.concat(mylist);
      mylist = this.uniq(mylist);
      localStorage.setItem('allTracks', JSON.stringify(mylist));

      this.allTracks = mylist;
      this.playlistService.setAllTracksSource(mylist);
      return mylist;
    }).catch(this.handleError);
  }

  uniq(arrArg) {
    return _.uniq(arrArg, function (p) { return p.id; });
  }

  getTrackById(id: number): Observable<any> {
    if (localStorage.getItem('allTracks') !== null) {
      return Observable.of(localStorage.getItem('allTracks')).map(store => {
        let mylist: any = JSON.parse(store);
        let allAlbums = JSON.parse(localStorage.getItem('allAlbums'));
        let allArtists = JSON.parse(localStorage.getItem('allArtists'));
        let allTracks = JSON.parse(localStorage.getItem('allTracks'));
        //allTracks = this.formatTracks(allArtists, allAlbums, allTracks);
        return allTracks.filter((track) => {
          if (track.id == id) {
            return this.formatTracks(allArtists, allAlbums, track);
          }
        })
      });
    } else {
      return this.getAllTracks();
    }
  }


  addFavorites(track) {
    return this.favoriteService.addFavorites(track);
  }

  removeFavorites(track) {
    return this.favoriteService.removeFavorites(track);
  }

  trackAnalytics(params) {
    let trackID = null,
      accountID = null,
      playlistID = null,
      downloadTemp = null;
    if (params === undefined) {
      return Observable.of('unknown track');
    } else {
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      accountID = this.authService.getUserSource();
      if (accountID !== undefined) {
        accountID = accountID.id;
      }
      if (params.hasOwnProperty('track')) {
        trackID = params.track.id;
        downloadTemp = params.track.download_temp;
      }
      if (params.hasOwnProperty('playlist')) {
        playlistID = params.playlist.id;
      }

      const body = {
        'track_id': trackID,
        'account_id': accountID,
        'download_temp': downloadTemp,
        'playlist_id': playlistID
      };

      return this.http.post(
        environment.api.url + environment.api.trackAnalytics,
        JSON.stringify(body),
        {headers: headers}).map((response: Response) => {
        return response.json().data;
      }).catch(this.handleError);
    }

  }

  getAllFavorites() {
    let favorites = [];
    let myfavs = [];
    if (localStorage.getItem('auth') !== null) {
      let store = localStorage.getItem('auth');
      store = JSON.parse(store);
      favorites = store['favorites'];
      if (favorites !== undefined) {
        favorites.filter((track) => {
          this.getTrackById(track.track_id).subscribe(
            (fav) => {
              myfavs.push(fav[0]);
            }
          )
        })
      }
    }
    return myfavs;

  }

  formatTracks(allArtists, allAlbums, allTracks) {

    if (allTracks instanceof Array) {

      this.allTracks = this.allTracks.filter(track => {
        let artist = allArtists.find(artists => artists.id == track.artist_id);
        let album = allAlbums.find(albums => albums.id == track.album_id);
        track.artist = artist;
        track.album = album;
        track.favorite = this.favoriteService.getFavoriteById(track.id);
        return track;
      });
      return this.allTracks;

    } else {
      let track = allTracks;
      let artist = allArtists.find(artists => artists.id == track.artist_id);
      let album = allAlbums.find(albums => albums.id == track.album_id);
      track.favorite = this.favoriteService.getFavoriteById(track.id);
      track.artist = artist;
      track.album = album;
      return track;
    }

  }

  handleError(error: any) {
    return Observable.throw(error.json().error || 'Server error');
  }

}
