import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensingTermsComponent } from './licensing-terms.component';

describe('LicensingTermsComponent', () => {
  let component: LicensingTermsComponent;
  let fixture: ComponentFixture<LicensingTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensingTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensingTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
