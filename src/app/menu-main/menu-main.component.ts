import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/user/user'
import {MdDialog, MdSnackBar, MdDialogConfig, MdDialogRef} from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { CartService } from '../cart/cart.service';
import { DialogService } from '../shared/dialog.service';
import {FavoriteService} from '../account/favorites/favorite.service';

@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',
  styleUrls: ['./menu-main.component.css', '../shared/styles/mobile.scss' ],
  changeDetection: ChangeDetectionStrategy.Default

})
export class MenuMainComponent implements OnInit {

  searchTerm:string;
  @Output() searchTermUpdate: EventEmitter<string> = new EventEmitter<string>();
  @Input() isLoggedIn:boolean=false;
  isNavbarCollapsed = true;
  countFavs:number = 0;
  selectedValue: string;
  user:User;
  cartItems;
  signinForm;
  showCategoriesdd = false;
  currentCategory;
  filterByCategories = [
    {name:'Playlist',value:'playlist'},
    {name:'Lyrics',value:'lyrics'},
    {name:'Artist',value:'artist'},
    {name:'All Categories',value:'all'},
  ]
  constructor(
    public dialog: MdDialog,
    private router: Router,
    private auth:AuthService,
    private cartService:CartService,
    private dialogService:DialogService,
    private favoriteService:FavoriteService

  ) { }

  searchUpdate(){
    this.searchTermUpdate.emit(this.searchTerm)
  }
  searchClear(){
    this.searchTerm = "";
    this.searchTermUpdate.emit(this.searchTerm)
  }
  ngOnInit() {
    this.currentCategory = this.filterByCategories[3];
    this.signinForm = this.dialog;


    if(this.auth.getUserSource() != undefined){
      this.user = this.auth.getUserSource();
      if(this.user != null){
        this.isLoggedIn = true;
        if(this.user['favorites'] !== undefined){
          this.countFavs = this.user['favorites'].length;
        } else {
          this.countFavs = 0;
        }
      }
    }
    this.auth.userSourceUpdated.subscribe(
      (data: User) => {
        if(data != null){
          this.user = data
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      }
    );

    this.favoriteService.favoriteSourceUpdated.subscribe(
      (favorites) => {
        this.countFavs = favorites.length
      }
    );

  }

  onToggleCategoriesDD(){
    this.showCategoriesdd = (this.showCategoriesdd) ? false : true;
  }
  onHideCategoriesDD(e){
    this.showCategoriesdd = false;
  }
  onChange(e){
    this.onHideCategoriesDD(e);
    const index:number = this.filterByCategories.findIndex(i => i.value === e.currentTarget.value);
    this.currentCategory = this.filterByCategories[index];
  }
  onLogin(){
    this.dialog.open(LoginComponent)
  }
  onSignUp() {
    let config = new MdDialogConfig();
    let dialogRef:MdDialogRef<SignUpComponent> = this.signinForm.open(SignUpComponent, config)
    dialogRef.componentInstance.headline = "Create Account";
    dialogRef.afterClosed().subscribe(result => {

      this.dialogService.setIsOpen(false);
      if (result == undefined) {

      }
    })
  }
  onSubmit() {
    this.router.navigate(['/search/']);
  }

}
