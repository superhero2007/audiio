import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedPlaylistComponent } from './followed-playlist.component';

describe('FollowedPlaylistComponent', () => {
  let component: FollowedPlaylistComponent;
  let fixture: ComponentFixture<FollowedPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowedPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
