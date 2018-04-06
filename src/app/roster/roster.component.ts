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
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['../shared/styles/hero.scss', '../main/main.component.scss', './roster.component.scss', '../shared/styles/mobile.scss']
})
export class RosterComponent implements OnInit, OnDestroy {

  path: string;
  sub: Subscription;
  artists: any[] = [];

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
    this.titleService.setTitle('Audiio - Roster');
    this.getAllArtists();
  }

  getAllArtists() {

    this.playlistsService.getAllArtistsSource().filter(artist => {
      artist.uri = '/artist/' + artist.slug;
      this.artists.push(artist);
      /*if (track.artist !== undefined) {
        if (track.artist.slug == params['artist']) {
          this.hasTracks = true;
          this.artist = track.artist;
          this.banner = this.path + "/" +track.artist.image_banner;
          this.tracks.push(track);
        }
      }*/
    });

  };
}



