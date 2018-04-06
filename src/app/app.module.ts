import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ScrollSpyModule, ScrollSpyService } from 'ngx-scrollspy';
import { ScrollSpyIndexModule } from 'ngx-scrollspy/dist/plugin';
import { ScrollSpyAffixModule } from 'ngx-scrollspy/dist/plugin/affix';


import {GoogleAnalyticsEventsService} from './shared/google-analytics-events.service';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { BrowseComponent } from './browse/browse.component';
import { CartComponent } from './cart/cart.component';
import { CartService } from './cart/cart.service';
import { ContactComponent } from './contact/contact.component';
import { FourohfourComponent } from './fourohfour/fourohfour.component';
import { HelpComponent } from './help/help.component';
import { LegalComponent } from './legal/legal.component';
import { LicensingTermsComponent } from './licensing-terms/licensing-terms.component';
import { MenuMainComponent } from './menu-main/menu-main.component';
import { MenuFooterComponent } from './menu-footer/menu-footer.component';
import { PlayerComponent } from './player/player.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { MainComponent } from './main/main.component';
import { PlayerService } from './player/player.service';
import { PlaylistsService } from './playlists/playlists.service';
import { GenresComponent } from './genres/genres.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { ArtistComponent } from './artist/artist.component';
import { AlbumComponent } from './artist/album/album.component';
import { SongComponent } from './artist/album/song/song.component';
import { SharedModule } from './shared/shared.module'
import { AccountModule } from './account/account.module';
import { FilterTracksPipe } from './shared/pipe/filtertracks.pipe';
import { SearchTracksPipe } from './shared/pipe/searchtracks.pipe';
import { FilterTracksLengthPipe } from './shared/pipe/track-length.pipe';
import { OrderByPipe } from './shared/pipe/orderby.pipe';
import { SearchLyricsPipe } from './shared/pipe/search-lyrics.pipe';

import { AllTracksByArtistResolver } from './shared/all-tracks-by-artist.resolver';
import { PlaylistDetailsComponent } from './playlists/playlist-details/playlist-details.component';

import { TrackScrollDirective } from './shared/track-scroll.directive';
import {LocationStrategy, HashLocationStrategy, PathLocationStrategy} from '@angular/common';
import {SearchArtistsPipe} from './shared/pipe/search-artists.pipe';
import {SearchPlaylistsPipe} from './shared/pipe/search-playlists.pipe';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {FavoriteService} from './account/favorites/favorite.service';
import { RosterComponent } from './roster/roster.component';

const appRoutes: Routes = [
  {path: 'roster', component: RosterComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'artist/:artist', component: ArtistComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'artist/:artist/:album', component: AlbumComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'artist/:artist/:album/:song', component: SongComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'browse', component: BrowseComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'browse/:filter', component: BrowseComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'about', component: AboutComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'genres', component: GenresComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'playlists', component: PlaylistsComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'playlists/:slug', component: PlaylistDetailsComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'cart', component: CartComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'contact', component: ContactComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'legal', component: LegalComponent},
  {path: 'licensing-terms', component: LicensingTermsComponent},
  {path: 'privacy', component: PrivacyComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'home', redirectTo: '', pathMatch: 'full'},
  {path: 'reset-password/:token', component: ResetPasswordComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: 'index.php', redirectTo: '', pathMatch: 'full'},
  {path: '', component: MainComponent, resolve: { tracks: AllTracksByArtistResolver }},
  {path: '**', redirectTo: '', pathMatch: 'full'},
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '404', component: FourohfourComponent, resolve: { tracks: AllTracksByArtistResolver }}
];


@NgModule({
  declarations: [
    AppComponent,
    BrowseComponent,
    PrivacyComponent,
    LegalComponent,
    LicensingTermsComponent,
    AboutComponent,
    ContactComponent,
    HelpComponent,
    SearchResultsComponent,
    PlayerComponent,
    CartComponent,
    FourohfourComponent,
    MenuMainComponent,
    MenuFooterComponent,
    MainComponent,
    GenresComponent,
    PlaylistsComponent,
    ArtistComponent,
    AlbumComponent,
    SongComponent,
    FilterTracksPipe,
    SearchTracksPipe,
    SearchArtistsPipe,
    SearchPlaylistsPipe,
    FilterTracksLengthPipe,
    OrderByPipe,
    SearchLyricsPipe,
    PlaylistDetailsComponent,
    TrackScrollDirective,
    ResetPasswordComponent,
    RosterComponent
  ],
  imports: [

    RouterModule.forRoot(appRoutes, { useHash: false }),
    ScrollSpyModule.forRoot(),
    ScrollSpyIndexModule,
    ScrollSpyAffixModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    AccountModule,
    SharedModule
  ],
  entryComponents: [
  ],
  providers: [
    PlayerService,
    ScrollSpyService,
    PlaylistsService,
    CartService,
    AllTracksByArtistResolver,
    GoogleAnalyticsEventsService,
    FavoriteService,
    OrderByPipe,
    //{provide: LocationStrategy, useClass: HashLocationStrategy}
    {provide: LocationStrategy, useClass: PathLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
