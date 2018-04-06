import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import 'hammerjs';



import { FavoritesComponent } from './favorites/favorites.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowedArtistsComponent } from './followed-artists/followed-artists.component';
import { FollowedPlaylistComponent } from './followed-playlist/followed-playlist.component';
import { ProfileComponent } from './profile/profile.component';
import { BillingComponent } from './billing/billing.component';
import { LicensesComponent } from './licenses/licenses.component';
import { LicenseDetailsComponent } from './license-details/license-details.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { MusicComponent } from './music/music.component';
import { SharedModule } from '../shared/shared.module';
import { AccountMenuComponent } from './account-menu/account-menu.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutCompleteComponent } from './checkout/checkout-complete/checkout-complete.component';
import { CheckoutCustomComponent } from './checkout/checkout-complete/checkout-custom.component';
import { AccountGuardService } from './account-guard.service';
import { AllTracksByArtistResolver } from '../shared/all-tracks-by-artist.resolver';
import { ReceiptComponent } from './licenses/receipt/receipt.component';



@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'account/music', component: MusicComponent, canActivate:[AccountGuardService]},
      { path: 'account/licenses', component: LicensesComponent, canActivate:[AccountGuardService], resolve: { tracks: AllTracksByArtistResolver }},
      { path: 'account/licenses/receipt/:id', component: ReceiptComponent, canActivate:[AccountGuardService], resolve: { tracks: AllTracksByArtistResolver }},
      { path: 'account/billing', component: BillingComponent, canActivate:[AccountGuardService]},
      { path: 'account/favorites', component: FavoritesComponent, canActivate:[AccountGuardService]},
      { path: 'account/profile', component: ProfileComponent, canActivate:[AccountGuardService]},
      { path: 'account/checkout', component: CheckoutComponent},
      { path: 'account/checkout/complete', component: CheckoutCompleteComponent, canActivate:[AccountGuardService]},
      { path: 'account/checkout/custom', component: CheckoutCustomComponent, canActivate:[AccountGuardService]},
      { path: 'account', redirectTo: 'account/licenses', pathMatch: 'full', canActivate:[AccountGuardService]}

    ]),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    FavoritesComponent,
    FollowersComponent,
    FollowedArtistsComponent,
    FollowedPlaylistComponent,
    ProfileComponent,
    BillingComponent,
    LicensesComponent,
    LicenseDetailsComponent,
    PreferencesComponent,
    MusicComponent,
    CheckoutComponent,
    AccountMenuComponent,
    CheckoutCompleteComponent,
    CheckoutCustomComponent,
    ReceiptComponent],
  providers:[AccountGuardService]
})

export class AccountModule { }
