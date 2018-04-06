import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription }       from 'rxjs/Subscription';
import {PlaylistsService} from '../../playlists/playlists.service';

@Component({
  selector: 'app-album',
  templateUrl: 'album.component.html',
  styleUrls: ['../../shared/styles/hero.scss','album.component.css'],
  //animations: [ slideInOutAnimation],
  //host: {'[@slideInOutAnimation]': ''}
})
export class AlbumComponent implements OnInit {

  sub: Subscription;
  artist:string='';
  track:string='';
  album:string='';
  tracks:any[]=[];
  genres:any[]=[];
  moods:any[]=[];
  elements:any[]=[];
  playlists:any[]=[];
  hasTracks:boolean=false;

  constructor(
    private route: ActivatedRoute,
    private playlistsService: PlaylistsService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        this.getTracksByArtist(params);
      });
  }
  getTracksByArtist(params) {
    let mytracks:any[] = [];
    if(this.playlistsService.getAllTracksSource() !== undefined){
      this.playlistsService.getAllTracksSource().filter(track => {
        if(track.artist !== undefined) {
          if (track.artist.slug == params['artist']) {
            this.tracks.push(track);
            this.album = track.album;
            this.artist = track.artist;
            this.hasTracks=true;
          }
        }
      });
    } else {
      this.playlistsService.allTracksSourceUpdated.subscribe(
        (allTracks) => {
          allTracks.filter(track=>{
            this.playlistsService.allArtistsSourceUpdated.subscribe(
              (artists) => {
                this.playlistsService.allAlbumsSourceUpdated.subscribe(
                  (albums) => {
                    this.hasTracks=true;

                    albums.filter(album=>{
                      if(albums.slug == track.album_id){
                        track.albums = albums;
                      }
                    })
                    artists.filter(artist=>{
                       if(artist.id == track.artist_id){
                        track.artist = artist;
                       }
                    });

                    //mytracks.push(track);
                    //this.tracks = mytracks;
                  }
                );
              }
            );
          })
        }
      );
    }
  };
}


