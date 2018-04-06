import {Component, OnInit, Input, OnChanges, AfterContentInit, AfterViewInit} from '@angular/core';
import { showHideActions, buttonBounceLeft } from '../app.page-animations'
import {MdDialog, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {PlaylistsService} from '../../playlists/playlists.service';
import { PlayerService } from '../../player/player.service';
import { WishlistComponent } from '../../account/wishlist/wishlist.component';
import { ShareComponent } from '../../share/share.component';
import { CartService } from '../../cart/cart.service';
import { TrackWaveService } from './track-wave.service';
import {TrackSecondsPipe} from "../pipe/track-seconds.pipe";
import { ReceiptService } from '../../account/licenses/receipt/receipt.service';
import { environment } from '../../../environments/environment';
declare var WaveSurfer:any;

@Component({
  selector: 'app-track-download',
  templateUrl: 'track-download.component.html',
  styleUrls: ['track.component.css', 'track-download.component.css', '../styles/mobile.scss'],
  animations:[showHideActions, buttonBounceLeft],
  providers:[TrackSecondsPipe],
})
export class TrackDownloadComponent implements OnInit, OnChanges, AfterViewInit {


  @Input() title:string;
  @Input() artist:string;
  @Input() playtime_min:string;
  @Input() playtime_sec:string;
  @Input() track:any;
  @Input() download:any;
  @Input() order_number:any;
  @Input() purchase_date:any;
  @Input() expiration_date:any;
  @Input() contract:any;

  track_thumb:string;
  private wavesurfer:any;
  mouseOvered = false;
  mouseOver = false;
  playlist:any = [];
  selectedOption: string;
  state = 'hideActions';
  inCart = false;
  constructor(
    public dialog: MdDialog,
    private router: Router,
    private playlistsService: PlaylistsService,
    private playerService:PlayerService,
    private cartService:CartService,
    private trackWaveService:TrackWaveService,
    private receiptService:ReceiptService,
    public snackBar: MdSnackBar) { }

  ngOnInit() {
    if(this.track != undefined){
      this.inCart = this.track.inCart;
    }

    if(this.track != undefined){
      if(this.track.hasOwnProperty('album')){
        if(this.track.album !== undefined){
          if(this.track.album.image.length > 1){
            this.track_thumb = environment.media.thumbs+this.track.album.image;
          }
        }
      }
    }
  }

  ngAfterViewInit(){
    if(this.track != undefined){
      this.track.mp3 = this.track.sound_pro.replace(/\.[^/.]+$/, ".mp3");
      this.track.m4a = this.track.sound_pro.replace(/\.[^/.]+$/, ".m4a");
      this.track.wavesurfer = WaveSurfer.create({
        container: '#waveform-'+this.track.id,
        waveColor: '#D2D2D2',
        progressColor: '#FD3F92',
        barHeight: 5,
        barWidth:10,
        mediaType:'audio',
        normalize:true,
        cursorWidth:0,
        height:75,
        width:300
      });
      this.trackWaveService.setTrackWave(this.track);
    }
  }

  ngOnChanges(){
    //this.artist = this._sanitizer.sanitize(SecurityContext.HTML, this.artist);
  }

  onNavigateToAlbum(){
    //this.router.navigate(['/artist/'+this.track.artist.slug+'/'+this.track.album.slug]);
  }
  onNavigateToTrack(){
    this.router.navigate(['/artist/'+this.track.artist.slug+'/'+this.track.album.slug+'/'+this.track.slug]);
  }
  onNavigateToArtist(){
    this.router.navigate(['/artist/'+this.track.artist.slug])
  }

  onPlayPause(track:any){
    if(track.wavesurfer.isPlaying()){
      this.trackWaveService.pauseAllWaves(track);
    } else {
      this.trackWaveService.pauseAllWaves(track);
      this.trackWaveService.playWave(track);
    }
  }
  onPlay(track:any){ console.log('onPlay from track-download comp');
    this.trackWaveService.pauseAllWaves(track);
    this.trackWaveService.playWave(track);
  }

  onReceipt(track:any){

    this.receiptService.setReceiptSource(track);
    this.router.navigate(['account/licenses/receipt/'+track.license.order_number]);
  }
  onDownload(track:any){

    window.open(environment.media.path + track.sound_pro);
    //window.location.href = this.track.wavesurfer.song+'?param=x';
  }

  onLicense(){
    this.cartService.addCartSource(this.track);
    this.router.navigate(['account/checkout']);
  }


}