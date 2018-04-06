import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {PlaylistsService} from '../playlists/playlists.service';
import {TrackService} from '../shared/track/track.service';


@Injectable()
export class AllTracksByArtistResolver implements Resolve<any> {

  errorMessage: string;
  errors: any[];
  tracks;

  constructor(private playlistsService: PlaylistsService,
              private trackService: TrackService) {
  }

  resolve(route: ActivatedRouteSnapshot) {

    let params = route.params;
    let artist;
    //if (params.hasOwnProperty('artist')) {
      //this.animate.onPreLoad();
      if (this.tracks == undefined) {

        //if (this.playlistsService.getAllTracksSource() == undefined) {
        this.trackService.getAllTracks()
        .subscribe(
          (tracks: any) => {
            return this.trackService.getAllArtists().subscribe((artists: any) => {
              this.trackService.getAllPlaylists().subscribe((playlists:any)=>{
                this.playlistsService.setAllPlaylistsSource(playlists);
              })
              return this.trackService.getAllAlbums().subscribe((albums: any) => {
                this.tracks = this.trackService.formatTracks(artists, albums, tracks);
                this.playlistsService.setAllAlbumsSource(albums);
                this.playlistsService.setAllArtistsSource(artists);
                this.playlistsService.setAllTracksSource(this.tracks);
                return this.tracks
              })
            })
          }),
          (error:any) => this.handleError(error)


      } else {
        this.playlistsService.getAllAlbumsSource();
        this.playlistsService.getAllArtistsSource();
        this.playlistsService.getAllTracksSource();
        this.playlistsService.getAllPlaylistsSource()
        return this.tracks;
      }
    //}
  }
  handleError(e){
  }
}
