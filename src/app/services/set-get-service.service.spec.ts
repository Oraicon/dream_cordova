import { TestBed } from '@angular/core/testing';

import { SetGetServiceService } from './set-get-service.service';

describe('SetGetServiceService', () => {
  let service: SetGetServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetGetServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
