import { TestBed } from '@angular/core/testing';

import { NativegeocoderServiceService } from './nativegeocoder-service.service';

describe('NativegeocoderServiceService', () => {
  let service: NativegeocoderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativegeocoderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
