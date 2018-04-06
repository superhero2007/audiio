import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription}       from 'rxjs/Subscription';
import {PlaylistsService} from '../../playlists/playlists.service';
import {TrackService} from '../../shared/track/track.service';
import { environment } from '../../../environments/environment'
import {User} from '../../shared/user/user';
import {AuthService} from '../../shared/auth/auth.service';
import {FavoriteService} from './favorite.service';
import {TrackWaveService} from '../../shared/track/track-wave.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['../../shared/styles/hero.scss', './favorites.component.css', '../account.scss', '../../shared/styles/mobile.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  sub: Subscription;
  track: string = '';
  tracks: any[] = [];
  playlist: any;
  path:string;
  banner:string;
  hasTracks:boolean=false;
  user:User;

  constructor(
    private route: ActivatedRoute,
    private playlistsService: PlaylistsService,
    private trackService: TrackService,
    private authService: AuthService,
    private favoriteService:FavoriteService,
    private trackWaveService:TrackWaveService
  ) { }

  ngOnDestroy(){

  }
  ngOnInit() {
    this.user = this.authService.getUserSource();
    this.path = environment.media.path;
    this.sub = this.route.params.subscribe(
      params => {
      });
    this.tracks = this.trackService.getAllFavorites()
    if(this.tracks.length > 0){
      this.hasTracks = true;
    } else {
      this.hasTracks = false;
    }

    this.authService.userSourceUpdated.subscribe(
      (user) => {
        //this.tracks = this.trackService.getAllFavorites()
      }
    );

    this.favoriteService.favoriteRemoveUpdate.subscribe(
      (id) => {
        let tracks = this.tracks;
        let fav = tracks.map(match => match.id).indexOf(id);
        if(fav >= 0){
          this.tracks.splice(fav, 1);
        }

        if(this.tracks.length > 0){
          this.hasTracks = true;
        } else {
          this.hasTracks = false;
        }
      }
    );
  }

}
