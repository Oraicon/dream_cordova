import { TestBed } from '@angular/core/testing';

import { SizecountServiceService } from './sizecount-service.service';

describe('SizecountServiceService', () => {
  let service: SizecountServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SizecountServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
