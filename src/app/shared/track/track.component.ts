import {Component, OnInit, Input, OnChanges, AfterContentInit, AfterViewInit, OnDestroy} from '@angular/core';
import {showHideActions, buttonBounceLeft} from '../app.page-animations'
import {MdDialog, MdSnackBar, MdTooltipModule} from '@angular/material';
import {Router} from '@angular/router';
import {PlaylistsService} from '../../playlists/playlists.service';
import {PlayerService} from '../../player/player.service';
import {WishlistComponent} from '../../account/wishlist/wishlist.component';
import {ShareComponent} from '../../share/share.component';
import {CartService} from '../../cart/cart.service';
import {TrackWaveService} from './track-wave.service';
import {SignUpComponent} from '../../sign-up/sign-up.component';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthService} from '../auth/auth.service';
import {DialogService} from '../dialog.service';
import {environment} from '../../../environments/environment';
import {Http, Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {TrackService} from './track.service';

declare var WaveSurfer: any;

@Component({
  selector: 'app-track',
  templateUrl: 'track.component.html',
  styleUrls: ['track.component.css', '../styles/mobile.scss'],
  animations: [showHideActions, buttonBounceLeft],
})
export class TrackComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {


  @Input() title: string;
  @Input() artist: string;
  @Input() playtime_min: string;
  @Input() playtime_sec: string;
  @Input() track: any;
  playing: any;
  playlist: any = [];
  state = 'hideActions';
  inCart = false;
  signinForm;
  mouseOver;
  track_thumb: string;
  favorite: boolean = false;
  error;

  constructor(public dialog: MdDialog,
              private router: Router,
              private cartService: CartService,
              private trackWaveService: TrackWaveService,
              private auth: AuthService,
              public snackBar: MdSnackBar,
              public tooltip: MdTooltipModule,
              private playListService: PlaylistsService,
              private dialogService: DialogService,
              private trackService: TrackService) { }

  ngOnDestroy() {
    this.trackWaveService.removeWave(this.track);
  }

  ngOnInit() {

    this.signinForm = this.dialog;

    if (this.track != undefined) {
      this.favorite = this.track.favorite;
    }

    if (this.track !== undefined) {
      if (this.track.hasOwnProperty('album')) {
        if (this.track.album !== undefined) {
          if (this.track.album.image.length > 1) {
            this.track_thumb = environment.media.thumbs + this.track.album.image;
          }
        }
      } else if (this.track.hasOwnProperty('albums')) {
        if (this.track.albums !== undefined) {
          if (this.track.albums.image.length > 1) {
            this.track_thumb = environment.media.thumbs + this.track.albums.image;
          }
        }
      }

      if (this.track.hasOwnProperty('wavesurferPlayer')) {
        this.playing = this.track.wavesurferPlayer.isPlaying();
      }
      this.trackWaveService.waveSourceUpdated.subscribe((track) => {
        this.playing = false;
        if (this.track.id == track.id && track.hasOwnProperty('wavesurferPlayer')) {
          setTimeout(() => this.playing = track.wavesurferPlayer.isPlaying(), 0)
        }
      });
    }

  }

  ngAfterViewInit() {
    let wave = this.trackWaveService.createWaveForm(this.track).subscribe(
      (wave) => {
      },
      (error) => {
        // remove wav from list due to loading error
        this.error = true;
      },
      () => {
      }
    );
  }

  ngOnChanges() { }

  toggleActions() {
    this.state = (this.state === 'hideActions' ? 'showActions' : 'hideActions' );
  }


  onNavigateToAlbum() {
    this.router.navigate(['/artist/' + this.track.artist.slug + '/' + this.track.album.slug]);
  }

  onNavigateToTrack() {
    this.router.navigate(['/artist/' + this.track.artist.slug + '/' + this.track.album.slug + '/' + this.track.slug]);
  }

  onNavigateToArtist() {
    this.router.navigate(['/artist/' + this.track.artist.slug])
  }

  onPause(track: any) {
    this.trackWaveService.pauseAllWaves(track);
  }

  onPlay(track: any) {
    this.trackWaveService.playWave(track);
  }

  onPlayPauseToggle(track) {
    if (this.playing) {
      this.onPause(track);
    } else {
      this.onPlay(track);
    }
  }

  onAdd() {
    this.dialog.open(WishlistComponent);
  }

  onSeek(e, track) {
    let isPlaying = false;

    if (track.hasOwnProperty('wavesurferPlayer')) {
      if (!track.wavesurferPlayer.isPlaying()) {
        isPlaying = false;
      } else {
        isPlaying = true;
      }
    }

    if (!isPlaying) {
      this.onPlay(track);
    } else {
      const wave = this.track['wavesurferPlayer'];
      if (wave !== undefined) {
        if (!this.auth.isAuthenticated) {
          this.signinForm.open(SignUpComponent).afterClosed().subscribe((result) => {
            this.dialogService.setIsOpen(false);
          })
        } else {
          const mouseXpos = Math.ceil(e.clientX - e.currentTarget.getBoundingClientRect().left);
          const waveXPos = Math.ceil(wave.getDuration() / (e.currentTarget.getBoundingClientRect().width / mouseXpos));
          const seekValue = waveXPos / wave.getDuration();
          track.resumeTime = seekValue;
          wave.seekTo(seekValue);
          this.trackWaveService.updateTrackWave(seekValue, this.track);
        }

      }
    }

  }

  onShare() {
    this.dialog.open(ShareComponent);
  }

  onFavorite() {
    if (!this.auth.isAuthenticated) {
      this.dialog.open(SignUpComponent);
    } else {
      if (this.track.favorite) {
        this.favorite = false;
        this.trackService.removeFavorites(this.track).subscribe(
          (favorite) => {
            this.auth.getUserSource();
            this.track.favorite = false;
            this.snackBar.open('Track is removed to favorites!', null, {
              duration: 1000,
            });
          }
        );
      } else {
        this.favorite = true;
        this.trackService.addFavorites(this.track).subscribe(
          (favorite) => {
            this.auth.getUserSource();
            this.track.favorite = true;
            this.snackBar.open('Track is added to favorites!', null, {
              duration: 1000,
            });
          }
        );
      }
    }
  }

  onDownload() {
    if (!this.auth.isAuthenticated) {
      this.dialog.open(SignUpComponent);
    } else {
      this.track.download_temp = 1;
      this.trackService.trackAnalytics({'track': this.track}).subscribe();
      window.open(environment.media.m4a + this.track.m4a);
    }
  }

  onLicense() {
    this.cartService.addCartSource(this.track);
    this.router.navigate(['account/checkout']);
  }

  handleError(error: any) {
    return Observable.throw('File Not Found');
  }
}