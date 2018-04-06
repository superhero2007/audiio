import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class PlaylistsService {

  playerQueueSource:any;
  playerQueueSourceUpdated = new EventEmitter<any>();

  playerQueueCurrentTrackSource:any;
  playerQueueCurrentTrackSourceUpdated = new EventEmitter<any>();

  allTracksSource:any;
  allTracksSourceUpdated = new EventEmitter<any>();

  allArtistsSource:any;
  allArtistsSourceUpdated = new EventEmitter<any>();

  allAlbumsSource:any;
  allAlbumsSourceUpdated = new EventEmitter<any>();

  allPlayerQueueSource:any;
  allPlayerQueueSourceUpdated = new EventEmitter<any>();

  allPlaylistsSource:any;
  allPlaylistsSourceUpdated = new EventEmitter<any>();

  queue:any;
  queueUpdate = new EventEmitter<any>();

  constructor() { }

  setQueue(queue){
    this.queue = queue;
    this.queueUpdate.emit(queue);
  }
  getQueue(){
    return this.queue;
  }

  setPlayerQueueSource(allTracks:any){
    this.playerQueueSource = allTracks;
    this.playerQueueSourceUpdated.emit(allTracks);
  }

  getPlayerQueueSource(): any {

    return this.playerQueueSource;
  }

  setPlayerQueueCurrentTrack(currentTrack){

    this.playerQueueCurrentTrackSource = currentTrack;
    this.playerQueueCurrentTrackSourceUpdated.emit(currentTrack);
  }

  getPlayerQueueCurrentTrack(): any {
    return this.playerQueueCurrentTrackSource;
  }

  getAllTracksSource(): any {
    return this.allTracksSource;
  }

  setAllTracksSource(allTracks:any){

    this.allTracksSource = allTracks;
    this.allTracksSourceUpdated.emit(allTracks);
  }

  getAllPlaylistsSource(): any {
    return this.allPlaylistsSource;
  }

  setAllPlaylistsSource(allTracks:any){

    this.allPlaylistsSource = allTracks;
    this.allPlaylistsSourceUpdated.emit(allTracks);
  }

  getAllArtistsSource(): any {
    return this.allArtistsSource;
  }

  setAllArtistsSource(allArtists:any){
    this.allArtistsSource = allArtists;
    this.allArtistsSourceUpdated.emit(allArtists);
  }

  getAllAlbumsSource(): any {
    return this.allAlbumsSource;
  }

  setAllAlbumsSource(allAlbums:any){

    this.allAlbumsSource = allAlbums;
    this.allAlbumsSourceUpdated.emit(allAlbums);
  }
  getAllPlayerQueueSource(): any {
    return this.allPlayerQueueSource;
  }

  setAllPlayerQueueSource(allPlaylists:any){

    this.allPlayerQueueSource = allPlaylists;
    this.allPlayerQueueSourceUpdated.emit(allPlaylists);
  }
}
