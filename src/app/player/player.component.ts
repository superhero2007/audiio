import {Component, Output, EventEmitter, Input, OnInit, OnChanges, AfterViewInit} from '@angular/core';
import {showHideActions, buttonBounceLeft} from '../shared/app.page-animations'
import {PlaylistsService} from '../playlists/playlists.service';
import {Router} from '@angular/router';
import {TrackWaveService} from '../shared/track/track-wave.service'
import {AuthService} from '../shared/auth/auth.service';
import {DialogService} from '../shared/dialog.service';
import {TrackSecondsPipe} from '../shared/pipe/track-seconds.pipe';
import {SignUpComponent} from '../sign-up/sign-up.component';
import {MdDialog, MdSnackBar, MdTooltipModule} from '@angular/material';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {CartService} from '../cart/cart.service';
import {TrackService} from '../shared/track/track.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['../shared/track/track.component.css', './player.component.css', '../shared/styles/mobile.scss'],
  animations: [showHideActions, buttonBounceLeft],
  providers: [TrackSecondsPipe]

})
export class PlayerComponent implements OnInit, AfterViewInit {

  @Input() title: string;
  @Input() artist: string;
  @Input() album: string;
  @Input() track_thumb: string;
  @Input() elapsed: string;
  @Input() total: string;
  @Input() current: number;
  @Input() playing = false;
  @Input() duration;
  @Output() backward = new EventEmitter();
  @Output() pauseplay = new EventEmitter();
  @Output() forward = new EventEmitter();
  @Output() random = new EventEmitter();
  @Output() stop = new EventEmitter();
  isSeeking = false;
  trackMax;
  trackCurrentTime;
  trackThumbLabel;
  volumeMax = 1;
  volume;
  track;
  isMute: boolean = false;
  playlist;
  wave;
  signinForm
  trackWaveServiceSub;
  favorite: boolean = false;
  hasShownSignup: boolean = false;


  constructor(private playlistsService: PlaylistsService,
              private router: Router,
              private trackWaveService: TrackWaveService,
              private dialog: MdDialog,
              private auth: AuthService,
              private dialogService: DialogService,
              public snackBar: MdSnackBar,
              private cartService: CartService,
              private trackService: TrackService,
              private trackSeconds: TrackSecondsPipe) { }

  ngOnInit() {
    this.volume = this.trackWaveService.getVolume().point;
    this.isMute = this.trackWaveService.getMute();
    this.signinForm = this.dialog;
    this.track = this.trackWaveService.getCurrentWave();
    this.trackWaveService.volumeUpdated.subscribe((volume) => { this.volume = volume.point; })
    this.trackWaveService.muteUpdated.subscribe((mute) => { this.isMute = mute; })
    this.trackWaveService.waveSourceUpdated.subscribe((play) => {

    });

    if (this.track != undefined) {
      this.favorite = this.track.favorite;
    }

    this.dialogService.dialogUpdated.subscribe((open) => {
      this.wave.pause();
      if (!open) {
        this.trackWaveServiceSub.unsubscribe()
        this.onTimer();
        this.onPlayheadReset();
      } else {

        this.trackWaveServiceSub.unsubscribe()
      }
    })
  }

  ngAfterViewInit() {
    this.onTimer();
    this.trackWaveService.playerReady();
  }

  onTimer() {

    this.trackWaveServiceSub = this.trackWaveService.waveTimeSource.subscribe((time) => {
      if (!this.isSeeking && this.track['wavesurferPlayer'] !== undefined) {

        this.track = this.trackWaveService.getCurrentWave();
        this.wave = this.track['wavesurferPlayer'];
        this.trackMax = this.wave.getDuration();
        this.trackCurrentTime = this.wave.getCurrentTime();
        this.playing = this.track['wavesurferPlayer'].isPlaying();
        this.favorite = this.track.favorite;
        this.onPlayheadTime(this.wave.getCurrentTime());
        this.trackWaveService.updateTrackWave(this.trackCurrentTime / this.wave.getDuration(), this.track);
        this.onSignupModal();
        this.onTrackEnd();

      }
    })
  }

  onTrackEnd() {

    if (Math.ceil(this.wave.getCurrentTime()) >= Math.ceil(this.wave.getDuration())) {
      this.onNext('forward');
    }
  }

  onSignupModal() {
    if (!this.auth.isAuthenticated && this.trackCurrentTime >= 30) {
      this.onPause();
      this.onPlayheadReset();
      if (!this.hasShownSignup) {
        this.hasShownSignup = true;
        if (!this.dialogService.getIsOpen()) {

          this.dialogService.setIsOpen(true)

          this.signinForm.afterOpen.subscribe((result) => {
            this.dialogService.setIsOpen(true);
          });

          this.signinForm.open(SignUpComponent).afterClosed().subscribe((result) => {
            this.dialogService.setIsOpen(false);
          })
        }
      }
    }
  }

  onPlayheadReset() {
    if (this.wave !== undefined) {
      this.trackCurrentTime = 0;
      this.wave.seekTo(0);
      this.trackWaveService.updateTrackWave(0, this.track);
    }
  }

  onPlayheadTime(currentTime) {

    let min = Math.floor(currentTime / 60);
    let sec = Math.floor(currentTime - min * 60);
    sec = this.trackSeconds.transform(sec);

    if (!isNaN(min)) {
      this.elapsed = min + ':' + sec;
    }

    min = Math.floor(this.wave.getDuration() / 60);
    sec = Math.floor(this.wave.getDuration() - min * 60);
    sec = this.trackSeconds.transform(sec);

    if (!isNaN(min)) {
      this.total = min + ':' + sec;
    }

  }

  onNext(pos) {
    this.wave.pause();
    let tracks = this.playlistsService.getQueue();
    let nextTrack = null;
    let currentIndex = tracks.map(function (e) { return e['id']; }).indexOf(this.track.id);

    let max = tracks.length - 1;
    if (pos == 'back') {
      nextTrack = tracks[currentIndex - 1];
      if (currentIndex == 0) {
        nextTrack = tracks[max];
      }
    } else {
      nextTrack = tracks[currentIndex + 1]
      if (currentIndex == max) {
        nextTrack = tracks[0];
      }
    }
    this.trackWaveService.playWave(nextTrack);


  }

  onPause() {

    this.trackWaveService.pauseAllWaves(this.track);

  }

  onPlay() {
    this.trackWaveService.playWave(this.track);
  }

  onSeekVolume(e) {

    this.trackWaveService.setMute(false);
    this.trackWaveService.setVolume(e.value);

  }

  onVolumeChange(e) {

    this.trackWaveService.setVolume(e.value);

  }

  onSeekChange(e) {

    this.isSeeking = false;
    this.wave.play();

  }

  onSeekDrag(e) {

    let newvalue = e.value / this.wave.getDuration();
    this.isSeeking = true;
    this.wave.pause();
    this.wave.seekTo(newvalue);
    this.onPlayheadTime(e.value);
    this.trackWaveService.updateTrackWave(newvalue, this.track);

  }


  onAdd() { }

  onShare() { }

  onMute() {

    this.isMute = (this.isMute) ? false : true;
    this.trackWaveService.setMute(this.isMute);

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
      window.open(environment.media.path + this.track.sound_pro);
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
