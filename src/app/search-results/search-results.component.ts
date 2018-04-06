import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {TrackService} from '../shared/track/track.service';
import {PagerService} from '../shared/pager.service';
import {PlaylistsService} from '../playlists/playlists.service';
import {FilterTracksPipe} from '../shared/pipe/filtertracks.pipe';
import {SearchTracksPipe} from '../shared/pipe/searchtracks.pipe';
import {SearchLyricsPipe} from '../shared/pipe/search-lyrics.pipe';
import {SearchArtistsPipe} from '../shared/pipe/search-artists.pipe';
import {SearchPlaylistsPipe} from '../shared/pipe/search-playlists.pipe';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment'


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  providers: [
    FilterTracksPipe,
    SearchTracksPipe,
    PagerService,
    SearchLyricsPipe,
    SearchArtistsPipe,
    SearchPlaylistsPipe,
  ]
})
export class SearchResultsComponent implements OnInit, OnChanges {

  @Input() search: string;
  category: string;
  path:string;
  showHideGenres = false;
  showHideMoods = false;
  showHideElements = false;
  allTracks = [];
  allArtists = [];
  allAlbums = [];
  allPlaylists = [];
  filteredTracks: any[];
  filteredPlaylists: any[];
  filteredArtists: any[];
  tracks: any;
  playlists:any;
  artists:any;
  filterBy = [];
  pager: any = {};
  pageMaxRows = 10;


  constructor(private trackService: TrackService,
              private router: Router,
              private pagerService: PagerService,
              private filterTracksPipe: FilterTracksPipe,
              private playlistsService: PlaylistsService,
              private searchLyricsPipe: SearchLyricsPipe,
              private searchArtistsPipe: SearchArtistsPipe,
              private searchPlaylistsPipe: SearchPlaylistsPipe
  ) { }

  ngOnInit() {
    this.path = environment.media.thumbs;
    if (this.playlistsService.getAllTracksSource() !== undefined) {

      this.allTracks = this.playlistsService.getAllTracksSource();
      this.allArtists = this.playlistsService.getAllArtistsSource();
      this.allAlbums = this.playlistsService.getAllAlbumsSource();
      this.allPlaylists= this.playlistsService.getAllPlaylistsSource();


    } else {
      this.playlistsService.allTracksSourceUpdated.subscribe(
        (tracks) => {
          this.playlistsService.allArtistsSourceUpdated.subscribe(
            (artists) => {

              this.playlistsService.allAlbumsSourceUpdated.subscribe(
                (albums) => {
                  this.allAlbums = albums;
                  this.allArtists = artists;
                  this.allTracks = this.trackService.formatTracks(artists, albums, tracks);
                  this.tracks = this.allTracks;
                }
              );

              this.playlistsService.allPlaylistsSourceUpdated.subscribe(
                (playlists) => {
                  this.allPlaylists = playlists;
                }
              )
            }
          );
        }
      );
    }


  }

  ngOnChanges() {
    if (this.search != undefined) {
      this.setPage(1)
    }
  }

  setPage(page: number) {
    if (page > 0 && (this.pager.totalPages == null || page <= this.pager.totalPages)) {
      this.filteredTracks = this.searchLyricsPipe.transform(this.allTracks, this.search);
      this.filteredPlaylists = this.searchPlaylistsPipe.transform(this.allPlaylists, this.search);
      this.filteredArtists = this.searchArtistsPipe.transform(this.allArtists, this.search);

      //this.playlistsService.setPlayerQueueSource(this.filteredTracks);

      this.playlists = this.filteredPlaylists;
      this.artists = this.filteredArtists;

      if (page > (Math.ceil(this.filteredTracks.length / this.pageMaxRows))) {
        this.pager = this.pagerService.getPager(this.filteredTracks.length, 1, this.pageMaxRows);
        this.setPage(this.pager.totalPages);
      } else {
        this.pager = this.pagerService.getPager(this.filteredTracks.length, page, this.pageMaxRows);
      }
      this.tracks = this.filteredTracks.slice(this.pager.startIndex, this.pager.endIndex + 1);
      if (this.tracks[0] === -1) {
        this.tracks = -1;
      }
      if (this.playlists[0] === -1) {
        this.playlists = -1;
      }
      if (this.artists[0] === -1) {
        this.artists = -1;
      }
    }
  }
  onClickPlaylist(playlist){
    this.search = '';
    this.router.navigate(['/playlists/'+playlist.slug]);
  }
  onNavigateToAlbum(track){
    this.search = '';
    this.router.navigate(['/artist/'+track.artist.slug+'/'+track.album.slug]);
  }
  onNavigateToTrack(track){
    this.search = '';
    this.router.navigate(['/artist/'+track.artist.slug+'/'+track.album.slug+'/'+track.slug]);
  }
  onNavigateToArtist(track){
    this.search = '';
    this.router.navigate(['/artist/'+track.artist.slug])
  }
  onClickArtist(track){

    this.search = '';
    this.router.navigate(['/artist/'+track.slug])
  }


}
