import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedArtistsComponent } from './followed-artists.component';

describe('FollowedArtistsComponent', () => {
  let component: FollowedArtistsComponent;
  let fixture: ComponentFixture<FollowedArtistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowedArtistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedArtistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
