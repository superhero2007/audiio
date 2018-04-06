import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user'
import { MdDialog, MdSnackBar, MdDialogRef } from '@angular/material';
import {DialogService} from '../dialog.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss', '../styles/mobile.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {


  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private dialogService:DialogService,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<LoadingComponent>
  ) {

  }

  ngOnInit() {
    this.dialogService.setIsOpen(true);
  }

  ngOnDestroy() {
    this.dialogService.setIsOpen(false);
  }

  onClose(){
    this.dialog.closeAll();
    this.dialogService.setIsOpen(false);
  }

}

