import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {PlaylistsService} from '../playlists/playlists.service';
import {TrackService} from '../shared/track/track.service';
import {environment} from '../../environments/environment';
import {GoogleAnalyticsEventsService} from '../shared/google-analytics-events.service';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-playlists',
  templateUrl: 'playlists.component.html',
  styleUrls: ['../shared/styles/hero.scss', 'playlists.component.css', '../shared/styles/mobile.scss']
})
export class PlaylistsComponent implements OnInit, OnDestroy, AfterViewInit {

  errorMessage: string;
  errors: any[];
  tracks;
  playlists;
  playlist_thumb;
  track_thumb: string;
  path: string;

  constructor(private playlistsService: PlaylistsService,
              private trackService: TrackService,
              private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
              private titleService: Title) { }

  ngOnInit() {
    this.googleAnalyticsEventsService.pageview('playlist');
    this.titleService.setTitle('Audiio - Playlist');
    this.path = environment.media.path;
    this.trackService.getAllPlaylists().subscribe(
      (playlists: any) => {
        this.playlists = playlists;
      }),
      (error: any) => this.handleError(error);

  }

  ngOnDestroy() {
    document.querySelectorAll('.playList')[0]['style']['color'] = 'black';
    document.querySelectorAll('.playList')[0]['style']['background'] = 'white';
  }

  ngAfterViewInit() {
    document.querySelectorAll('.playList')[0]['style']['color'] = 'white';
    document.querySelectorAll('.playList')[0]['style']['background'] = 'black';
  }


  handleError(e) {
  }

}
