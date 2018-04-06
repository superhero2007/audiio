import {Injectable, EventEmitter} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {MdDialog, MdSnackBar} from '@angular/material';
import {TrackService} from '../shared/track/track.service';
import {PlaylistsService} from '../playlists/playlists.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PlayerService {

  audio;
  tracks = [];
  currentTrack = 0;
  playlist;

  constructor(
    private http: Http,
    private playlistsService:PlaylistsService,
    public snackBar: MdSnackBar,
    private trackService: TrackService) {
  }
  load(url) {}
  play(track) {}

  loadQueue(playlist){
    this.playlist = playlist;
    this.play(playlist[this.currentTrack])
  }
  handleError(error: any) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
  formatTime(seconds) {
    let minutes:any = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }

}
