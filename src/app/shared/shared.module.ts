import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { FeaturedPlaylistsComponent } from './featured-playlists/featured-playlists.component'
import { TrackComponent } from './track/track.component';
import { TrackDownloadComponent } from './track/track-download.component';
import { RelatedArtistsComponent } from './related-artists/related-artists.component';

import { AuthService } from './auth/auth.service';
import { TrackService } from './track/track.service';
import { TrackWaveService } from './track/track-wave.service';
import { DialogService } from './dialog.service';

import { WishlistComponent } from '../account/wishlist/wishlist.component';
import { ShareComponent } from '../share/share.component';
import { LoginComponent } from '../login/login.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { SignUp2Component } from '../sign-up/sign-up-2.component';
import { InviteComponent } from '../invite/invite.component';
import { TrackSecondsPipe } from './pipe/track-seconds.pipe';
import { ReceiptService } from '../account/licenses/receipt/receipt.service';
import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';
import { LoadingComponent } from './loading/loading.component';
import { CustomFormComponent } from './custom-form/custom-form.component';

@NgModule({
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  declarations: [
    FeaturedPlaylistsComponent,
    TrackComponent,
    TrackDownloadComponent,
    RelatedArtistsComponent,
    LoginComponent,
    SignUpComponent,
    SignUp2Component,
    WishlistComponent,
    ShareComponent,
    InviteComponent,
    TrackSecondsPipe,
    ForgotPasswordComponent,
    LoadingComponent,
    CustomFormComponent
  ],
  exports: [
    FeaturedPlaylistsComponent,
    TrackComponent,
    TrackDownloadComponent,
    RelatedArtistsComponent
  ],
  entryComponents: [
    LoginComponent,
    SignUpComponent,
    LoadingComponent,
    SignUp2Component,
    WishlistComponent,
    ShareComponent,
    InviteComponent,
    ForgotPasswordComponent,
    CustomFormComponent
  ],
  providers:[
    AuthService,
    TrackService,
    TrackWaveService,
    DialogService,
    ReceiptService
  ]
})
export class SharedModule { }
