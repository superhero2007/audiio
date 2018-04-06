import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {PlaylistsService} from '../playlists/playlists.service';
import {GoogleAnalyticsEventsService} from '../shared/google-analytics-events.service';
import {OrderByPipe} from '../shared/pipe/orderby.pipe';
import {TrackWaveService} from '../shared/track/track-wave.service';
import {Title} from '@angular/platform-browser';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['../shared/styles/hero.scss', './artist.component.css', '../shared/styles/mobile.scss']
})
export class ArtistComponent implements OnInit, OnDestroy {

  path: string;
  sub: Subscription;
  artist: string = '';
  track: string = '';
  album: string = '';
  tracks: any[] = [];
  genres: any[] = [];
  moods: any[] = [];
  elements: any[] = [];
  playlists: any[] = [];
  hasTracks: boolean = false;
  banner: string = '';

  constructor(private route: ActivatedRoute,
              private playlistsService: PlaylistsService,
              private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
              private orderByPipe: OrderByPipe,
              private trackWaveService: TrackWaveService,
              private titleService: Title) { }

  ngOnDestroy() {
    this.playlistsService.allTracksSourceUpdated.unsubscribe();
  }

  ngOnInit() {
    this.path = environment.media.path;
    this.googleAnalyticsEventsService.pageview('artist');
    this.sub = this.route.params.subscribe(
      params => {
        this.getTracksByArtist(params);
        this.titleService.setTitle('Audiio - ' + this.artist['name']);
      });
  }

  getTracksByArtist(params) {
    this.tracks = [];
    if (this.playlistsService.getAllTracksSource() !== undefined) {
      this.playlistsService.getAllTracksSource().filter(track => {
        if (track.artist !== undefined) {
          if (track.artist.slug == params['artist']) {
            this.hasTracks = true;
            this.artist = track.artist;
            this.banner = this.path + "/" +track.artist.image_banner;
            this.tracks.push(track);
          }
        }
      });
    } else {
      this.playlistsService.allTracksSourceUpdated.subscribe(
        (tracks) => {
          tracks.filter(track => {
            if (track.artist !== undefined) {
              if (track.artist.slug == params['artist']) {
                this.hasTracks = true;
                this.tracks.push(track);
                this.album = track.album;
                this.artist = track.artist;
                this.banner = this.path + "/" +track.artist.image_banner;
              }
            }
          });
        }
      );
    }
  };
}


