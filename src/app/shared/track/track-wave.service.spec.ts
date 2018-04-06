import { TestBed, inject } from '@angular/core/testing';

import { TrackWaveService } from './track-wave.service';

describe('TrackWaveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackWaveService]
    });
  });

  it('should ...', inject([TrackWaveService], (service: TrackWaveService) => {
    expect(service).toBeTruthy();
  }));
});
