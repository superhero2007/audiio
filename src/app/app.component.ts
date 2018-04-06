import {Component, Optional, OnInit, Output, Input, AfterViewInit} from '@angular/core';
import {PlayerService} from './player/player.service';
import {PlaylistsService} from './playlists/playlists.service';
import {TrackWaveService} from './shared/track/track-wave.service';
import {environment} from '../environments/environment';
import { ScrollSpyModule, ScrollSpyService } from 'ngx-scrollspy';
import { ScrollSpyIndexModule } from 'ngx-scrollspy/dist/plugin';
import { ScrollSpyAffixModule } from 'ngx-scrollspy/dist/plugin/affix';


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./shared/styles/mobile.scss', 'app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  showPlayer = false;
  isLoggedIn = false;
  artist: string = '';
  album: string = '';
  track_thumb: string = '';
  current;
  playlist: any = [];
  hasThumb: boolean;
  searchValue: string;
  searchInput: string;

  title: string = '';
  position: number = 0;
  elapsed: string = '0:00';
  duration: string = '0:00';
  paused = true;
  tracks: any[] = [];
  maxHeight: number = 0;

  constructor(private trackWaveService: TrackWaveService,
              private scrollSpyService: ScrollSpyService) {
  }

  ngAfterViewInit() {
    this.maxHeight = window.innerHeight;
    this.scrollSpyService.getObservable('window').subscribe((e: any) => { });
    document.getElementById('spyHomeSlides').style.display = 'none';
  }
  ngOnInit() {
    this.maxHeight = window.innerHeight;
    this.setCacheExpiration();
    this.setVersion();

    this.trackWaveService.waveSourceUpdated.subscribe(
      (track) => {

        this.title = (track.hasOwnProperty('title') ? track.title : 'Unknown');
        if (track.hasOwnProperty('artist')) {
          if (track.artist !== undefined) {
            if (track.artist.hasOwnProperty('name')) {
              this.artist = track.artist.name;
            } else {
              this.artist = 'Unknown';
            }
          } else {
            this.artist = 'Unknown';
          }
        }
        if (track.hasOwnProperty('album')) {
          if (track.album !== undefined) {
            if (track.album.image.hasOwnProperty('length')) {
              if (track.album !== undefined) {
                if (track.album.image.length > 1) {
                  this.track_thumb = environment.media.thumbs + track.album.image;
                  this.hasThumb = true;

                } else {
                }
              }
            }
          }

        }
        if (!this.hasThumb) {
          this.track_thumb = null;
        }
        this.trackWaveService.setCurrentTrack(track);
        this.showPlayer = true;
      });

  }

  setVersion() {
    let localVersion = localStorage.getItem('version');
    let appVersion = environment.version;
    if (localVersion < appVersion) {
      localStorage.clear();
      localStorage.setItem('version', environment.version);
    } else {
      localStorage.setItem('version', environment.version);
    }
  }

  setCacheExpiration() {

    let currentDate = new Date().getTime();
    if (localStorage.getItem('expire') == null) {
      localStorage.setItem('expire', currentDate.toString());
    }

    let localExpire = parseInt(localStorage.getItem('expire'));
    let currentDatePlus24hours = new Date(localExpire + 60 * 60 * 24 * 1000).getTime()

    if (currentDate > currentDatePlus24hours) {
      localStorage.clear();
      localStorage.setItem('expire', currentDate.toString());
    }
  }

  onSearchUpdate(e) {
    this.searchInput = e;
  }

  onChangeRoute() {
    window.scrollTo(0, 0)
  }

  handleStop() {}

  handlePausePlay(track) { }

  handleBackward() { }

  handleForward() { }
}


