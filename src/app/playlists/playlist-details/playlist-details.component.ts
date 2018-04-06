import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {PlaylistsService} from '../../playlists/playlists.service';
import {TrackService} from '../../shared/track/track.service';
import {environment} from '../../../environments/environment';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-playlist-details',
  templateUrl: 'playlist-details.component.html',
  styleUrls: ['../../shared/styles/hero.scss', 'playlist-details.component.scss', '../../shared/styles/mobile.scss']
})
export class PlaylistDetailsComponent implements OnInit {

  sub: Subscription;
  track: string = '';
  tracks: any[] = [];
  playlist: any;
  path: string;
  banner: string;
  hasTracks: boolean = false;

  constructor(private route: ActivatedRoute,
              private playlistsService: PlaylistsService,
              private titleService: Title,
              private trackService: TrackService) { }

  ngOnInit() {
    this.path = environment.media.path;
    this.banner = '';
    this.sub = this.route.params.subscribe(
      params => {
        this.getTracksFromPlaylist(params);
        console.log(this.playlist['title']);
        this.titleService.setTitle('Audiio - Playlist - ' + this.playlist['title']);
        this.trackService.trackAnalytics({'playlist': this.playlist}).subscribe();

      });
  }

  getTracksFromPlaylist(params) {
    if (this.playlistsService.getAllPlayerQueueSource() !== undefined) {

      this.playlistsService.getAllPlayerQueueSource().filter(list => {
        if (list.slug === params.slug) {
          this.playlist = list;
          this.banner = this.path + list.image_banner;
          this.tracks = list.tracks;

        }
      });
    } else {
      this.trackService.getAllPlaylists().subscribe((playlist) => {
          playlist.filter(list => {
            if (list.slug == params.slug) {

              this.playlist = list;
              this.banner = this.path + list.image_banner;
              this.tracks = list.tracks;
              this.hasTracks = true;

            }
          });
        }
      );
    }
    ;
    this.hasTracks = true;
  };
}
