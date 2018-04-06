import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/user/user'
import {AuthService} from '../../shared/auth/auth.service';
import {PlaylistsService} from '../../playlists/playlists.service';
import {TrackService} from '../../shared/track/track.service';

import {GoogleAnalyticsEventsService} from "../../shared/google-analytics-events.service";

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['../../shared/styles/hero.scss', './licenses.component.css', '../account.scss', '../../shared/styles/mobile.scss']
})
export class LicensesComponent implements OnInit {
  user: User;
  tracks: any[];

  constructor(private authService: AuthService,
              private playlistsService: PlaylistsService,
              private trackService: TrackService,
              private googleAnalyticsEventsService: GoogleAnalyticsEventsService) { }

  ngOnInit() {
    this.googleAnalyticsEventsService.pageview('account/licenses');

    this.authService.userSourceUpdated.subscribe(
      (data: User) => {
        this.user = data
      }
    );
    this.user = this.authService.getUserSource();
    //this.tracks = this.user['license'];
    this.tracks = this.getTracksByArtist(this.user['license']);
  }

  getTracksByArtist(tracks) {
    let mytracks: any[] = [];
    if (this.playlistsService.getAllTracksSource() !== undefined) {
      this.playlistsService.getAllTracksSource().filter(track => {
        if (tracks !== undefined) {
          tracks.filter(lic => {
            if (track.id == parseInt(lic['track_id'])) {
              track.license = lic;
              mytracks.push(track);
            }
          })
        }
      });
    } else {

      this.playlistsService.allTracksSourceUpdated.subscribe(
        (allTracks) => {
          if (mytracks.length == 0) {
            allTracks.filter(track => {
              if (tracks !== undefined) {
                tracks.filter(lic => {
                  if (track.id == parseInt(lic['track_id'])) {
                    track.license = lic;
                    this.playlistsService.allArtistsSourceUpdated.subscribe(
                      (artists) => {
                        this.playlistsService.allAlbumsSourceUpdated.subscribe(
                          (albums) => {
                            albums.filter(album => {
                              if (albums.id == track.album_id) {
                                track.albums = albums;
                              }
                            })
                            artists.filter(artist => {
                              if (artist.id == track.artist_id) {
                                track.artist = artist;
                              }
                            });
                            mytracks.push(track);
                          }
                        );
                      }
                    );
                  }
                })
              }
            });
          }
        }
      );
    }

    this.tracks = mytracks;
    return mytracks;


  };

}

