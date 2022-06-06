import { TestBed } from '@angular/core/testing';

import { NotifServiceService } from './notif-service.service';

describe('NotifServiceService', () => {
  let service: NotifServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
