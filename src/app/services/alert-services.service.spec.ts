import { TestBed } from '@angular/core/testing';

import { AlertServicesService } from './alert-services.service';

describe('AlertServicesService', () => {
  let service: AlertServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
