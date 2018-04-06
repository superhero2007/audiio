import {Injectable, EventEmitter} from '@angular/core';

declare var WaveSurfer: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';
import {environment} from '../../../environments/environment';
import {Http, Response} from '@angular/http';
import {TrackService} from './track.service';
import {PlaylistsService} from '../../playlists/playlists.service';
import {FavoriteService} from '../../account/favorites/favorite.service';
import {MdDialog, MdSnackBar, MdTooltipModule} from '@angular/material';

@Injectable()
export class TrackWaveService {

  wavesurfer: any;
  waves = [];
  wave;
  waveSourceUpdated = new EventEmitter<any>();
  waveTimeSource;
  env;
  audioElements;
  track;
  volume;
  mute;
  volumeUpdated = new EventEmitter<any>();
  muteUpdated = new EventEmitter<any>();


  constructor(private http: Http,
              private trackService: TrackService,
              private playListService: PlaylistsService,
              private favoriteService: FavoriteService,
              public snackBar: MdSnackBar) { }

  setTrackWave(track: any): Observable<any> {

    const path = environment.media.json;
    const filename = track.sound_pro.replace(/\.[^/.]+$/, '.json');
    track.favorite = this.favoriteService.getFavoriteById(track.id);
    this.getTrackWaveJson(path + filename).subscribe(
      (data) => {
        track.wavesurfer.backend.peaks = data;
        track.wavesurfer.drawer.containerWidth = '100px';
        track.wavesurfer.drawBuffer();
        track.wavesurfer.song = environment.media.mp3 + track.mp3;
        const awsFileName = track.mp3.split(' ').join('+');
        track.wavesurfer.song = environment.cloudFront + awsFileName;
        track.wavesurfer.loaded = false;
      },
      (error) => {
        this.handleJSONError(error, this.waves, track);
      }
    );
    this.waves.push(track);

    return this.getTrackWaveJson(path + filename);
  }

  removeWave(track) {
    // this.waves.splice(this.waves.indexOf(track),1);
  }

  getTrackWaveJson(path): Observable<any> {

    return this.http.get(path).map((resp: Response) => {
      return resp.json();
    });
  }

  getAllWaves() {
    return this.waves;
  }

  getCurrentWaves() {

  }

  setCurrentTrack(track: any) {
    this.track = track;
  }

  getCurrentWave(): Observable<any>[] {
    return this.track;
  }

  getMute() {
    if (this.mute === undefined) {
      this.mute = false;
    }
    return this.mute;
  }

  setMute(toggle) {
    this.mute = false;
    if (toggle) {
      this.mute = true;
    }
    this.wave.wavesurferPlayer.setMute(this.mute);
    this.muteUpdated.emit(this.mute);
  }

  setVolume(volume) {
    const vo = {point: volume, value: volume / 100};
    this.wave.wavesurferPlayer.setVolume(vo.value);
    this.volumeUpdated.emit(vo);
  }

  getVolume() {
    if (this.volume === undefined) {
      this.volume = 50;
    }
    const vo = {point: this.volume, value: this.volume / 100};
    return vo;
  }

  playerReady() {
    this.createPlayerWaveForm(this.track);
  }

  playWave(track) {
    let resumeTrack = false;
    this.setCurrentTrack(track);
    this.trackService.trackAnalytics({'track': track}).subscribe();

    const playerWaveForm = document.getElementById('player-waveform');
    if (!playerWaveForm) {
      this.waveSourceUpdated.emit(track);
    } else {
      if (track.wavesurferPlayer !== undefined) {
        if (track.wavesurferPlayer.getCurrentTime() >= 1) {
          resumeTrack = true;
          track.resumeTime = track.wavesurferPlayer.getCurrentTime();
        }
      }
      while (playerWaveForm.firstChild) {
        playerWaveForm.removeChild(playerWaveForm.firstChild);
      }
      const parent = this;
      this.createPlayerWaveForm(track);
    }
    this.playListService.setQueue(this.waves);
    this.waveTimeSource = Observable.timer(1000, 300);
  }

  /*playNext(track) {

    this.setCurrentTrack(track);
    this.trackService.trackAnalytics({'track': track}).subscribe();

    const playerWaveForm = document.getElementById('player-waveform')
    while (playerWaveForm.firstChild) {
      playerWaveForm.removeChild(playerWaveForm.firstChild);
    }
    const parent = this;
    track.wavesurfer.on('ready', function () {
      //track.playing = true;
      //track.wavesurfer.play();
    })
    //this.createPlayerWaveForm(track);
  }*/

  updateTrackWave(pointValue, track) {
    if (track['wavesurfer'] !== null) {
      if (document.getElementById(track['wavesurfer'].container.id) != null) {
        const waveWidth = document.getElementById(track['wavesurfer'].container.id).getElementsByTagName('wave')[0]['offsetWidth'];
        const point = pointValue * waveWidth;
        const currentWaveForm = document.getElementById(this.track['wavesurfer'].container.id).getElementsByTagName('wave')[1];
        currentWaveForm['style']['width'] = point + 'px';
      }
    }
  }

  pauseAllWaves(track) {
    track.wavesurfer.pause();
    this.getAllWaves().map(
      (item) => {
        item['wavesurfer'].pause();
      });
    this.audioElements = document.getElementsByTagName('audio');
    for (let i = 0; i < this.audioElements.length; i++) {
      this.audioElements[i].pause();
    }
    if (this.wave !== undefined) {
      this.waveSourceUpdated.emit(this.wave);
    }
  }

  createPlayerWaveForm(track) {
    if (track === undefined) {
      track = this.track;
    }
    const container = document.getElementById('player-waveform');
    const totalTime = (track.playtime_min * 60) + track.playtime_sec;
    track.fullDuration = totalTime;

    this.wave = track;
    if (this.wave.wavesurfer.song !== undefined) {
      this.wave.mp3 = track.sound_pro.replace(/\.[^/.]+$/, '.mp3');
      this.wave.m4a = track.sound_pro.replace(/\.[^/.]+$/, '.m4a');
      this.wave.wavesurferPlayer = WaveSurfer.create({
        container: container,
        waveColor: '#D2D2D2',
        progressColor: '#FD3F92',
        barHeight: 10,
        mediaType: 'audio',
        normalize: true,
        cursorWidth: 0,
        height: 30,
        fillParent: true,
        responsive: true,
        backend: 'MediaElement',
        pixelRatio: 10,
        minPxPerSec: (container.offsetWidth / totalTime) / 3,
        title: this.wave.title + '\n' + this.wave.artist.name + '\n' + 'Audiio.com',
        poster: environment.media.thumbs + this.wave.album.image
      });

      this.wave.wavesurferPlayer.load(this.wave.wavesurfer.song);
      this.wave.wavesurferPlayer.setVolume(this.getVolume().value);
      this.wave.wavesurferPlayer.setMute(this.getMute());
      const myWave = this.wave;
      const me = this;
      this.wave.wavesurferPlayer.on('finish', function () {
        me.finished(myWave);
      });
      this.wave.wavesurferPlayer.on('waveform-ready', function () {
        me.waveFormReady(myWave);
      });
      this.wave.wavesurferPlayer.on('loading', function () {
        me.loading(myWave);
      });
      this.wave.wavesurferPlayer.on('ready', function () {
        me.waveAudioReady(myWave);
      });
      myWave.wavesurferPlayer.play();
      me.waveSourceUpdated.emit(myWave);
    } else {
      this.snackBar.open('Unable to play ' + track.title + ' by ' + track.artist.name + '.', null, {
        duration: 5000,
      });
    }
    this.setCurrentTrack(this.wave);

  }

  createWaveForm(track): Observable<any> {
    const container = document.getElementById('waveform-' + track.id);
    const totalTime = (track.playtime_min * 60) + track.playtime_sec;
    track.fullDuration = totalTime;
    if (track !== undefined) {
      track.mp3 = track.sound_pro.replace(/\.[^/.]+$/, '.mp3');
      track.m4a = track.sound_pro.replace(/\.[^/.]+$/, '.m4a');
      track.wavesurfer = WaveSurfer.create({
        container: container,
        waveColor: '#D2D2D2',
        progressColor: '#FD3F92',
        barHeight: 10,
        barWidth: 2,
        mediaType: 'audio',
        normalize: true,
        cursorWidth: 0,
        height: 30,
        fillParent: true,
        responsive: true,
        backend: 'MediaElement',
        pixelRatio: 10,
        audioRate: .5,
        minPxPerSec: (container.offsetWidth / totalTime) / 3
      });
      return this.setTrackWave(track);
    }
  }

  finished(myWave) {
    myWave.resumeTime = null;
  }

  loading(myWave) {
  }

  waveFormReady(myWave) {
    console.log('waveready');
  }

  waveAudioReady(myWave) {
    myWave.wavesurferPlayer.playing = true;
    if (myWave.hasOwnProperty('resumeTime')) {
      if (myWave.resumeTime < myWave.wavesurferPlayer.getDuration()) {
        myWave.wavesurferPlayer.seekTo(myWave.resumeTime / myWave.wavesurferPlayer.getDuration());
        if (Math.floor(myWave.wavesurferPlayer.getCurrentTime()) >= Math.floor(myWave.wavesurferPlayer.getDuration())) {
          myWave.wavesurferPlayer.seekTo(0);
          this.waveSourceUpdated.emit(myWave);
          console.log('reset');
        }

      } else {
        myWave.wavesurferPlayer.seekTo(0);
      }
    }
  }

  handleJSONError(error: any, waves, track) {
    const removeItem = waves.findIndex(item => item.id === track.id);
    this.waves.splice(removeItem, 1);
  }

  handleError(error: any): Observable<any> {
    return Observable.throw('File Not Found');
  }

}
