import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {PlaylistsService} from '../../../playlists/playlists.service';
import {environment} from '../../../../environments/environment';
import {GoogleAnalyticsEventsService} from '../../../shared/google-analytics-events.service';
import {TrackWaveService} from '../../../shared/track/track-wave.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-song',
  templateUrl: 'song.component.html',
  styleUrls: ['../../../shared/styles/hero.scss', 'song.component.css', '../../../shared/styles/mobile.scss']
})
export class SongComponent implements OnInit {

  sub: Subscription;
  artist: string = '';
  track: string = '';
  album: string = '';
  tracks: any[] = [];
  genres: any[] = [];
  moods: any[] = [];
  elements: any[] = [];
  playlists: any[] = [];
  track_thumb: string;
  hasTracks: boolean = false;
  hasLyrics: boolean = false;
  lyrics: string;
  title: string;
  artistName: string = '';

  constructor(private route: ActivatedRoute,
              private playlistsService: PlaylistsService,
              private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
              private titleService: Title,
              private trackWaveService: TrackWaveService) { }


  ngOnInit() {
    this.googleAnalyticsEventsService.pageview('song/');

    this.tracks = [];
    //this.track_thumb = 'https://d3rtks05ujgkhe.cloudfront.net/assets/image/logo-A-black.png';
    this.sub = this.route.params.subscribe(
      params => {
        this.getTracksByArtist(params);
        this.titleService.setTitle('Audiio - ' + this.artistName + ' - ' + this.title);
      });
  }

  getTags(track) {
    let prop;
    if (track.lyrics.length > 10) {
      this.hasLyrics = true;
    }
    for (let key in track) {
      prop = prop = key.substring(key.indexOf('_') + 1, key.length);
      prop.replace('_', ' ');

      if (key.indexOf('genre_') >= 0 && track[key] > 0) {
        this.genres.push(prop);
      }
      if (key.indexOf('ele_') >= 0 && track[key] > 0) {
        this.elements.push(prop);
      }
      if (key.indexOf('mood_') >= 0 && track[key] > 0) {
        this.moods.push(prop);
      }
    }
  }

  getTracksByArtist(params) {
    this.tracks = [];
    if (this.playlistsService.getAllTracksSource() !== undefined) {
      this.playlistsService.getAllTracksSource().filter(track => {
        if (track.artist !== undefined) {
          if (track.slug == params['song'] && track.artist.slug == params['artist']) {

            this.tracks = [];
            this.tracks.push(track);
            this.getTags(track);
            this.track_thumb = environment.media.thumbs + track.album.image;
            this.hasTracks = true;
            this.lyrics = track.lyrics;
            this.title = track.title;
            this.artistName = track.artist.name;
          }
          ;
          /*if(track.slug == params['song']){
            this.track = track;
            this.album = track.album;
            this.artist = track.artist;
            if(track.hasOwnProperty('album')){
              if(track.album !== undefined){
                if(track.album.image.length > 1){
                  this.track_thumb = environment.media.thumbs+track.album.image;
                }
              }
            }
          }*/
        }
      });
    } else {
      this.playlistsService.allTracksSourceUpdated.subscribe(
        (tracks) => {
          tracks.filter(track => {

            if (track.artist !== undefined) {
              if (track.slug == params['song'] && track.artist.slug == params['artist']) {
                this.tracks = [];
                this.tracks.push(track);
                this.getTags(track);
                this.track_thumb = environment.media.thumbs + track.album.image;
                this.hasTracks = true;
                this.lyrics = track.lyrics;
                this.title = track.title;
                this.artistName = track.artist.name;
              }
              ;
              /*if (track.slug == params['song']) {
                this.track = track;
                this.album = track.album;
                this.artist = track.artist;
                if(track.hasOwnProperty('album')){
                  if(track.album !== undefined ){
                    if(track.album.image.length > 1){
                      this.track_thumb = environment.media.thumbs+track.album.image;
                    }
                  }
                }
              }*/

              //this.trackWaveService.setAllWaves(this.tracks);
            }
          });
        }
      );
    }
  };
}
