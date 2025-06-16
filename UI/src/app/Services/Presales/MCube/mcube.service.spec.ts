import { TestBed } from '@angular/core/testing';

import { McubeService } from './mcube.service';

describe('McubeService', () => {
  let service: McubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(McubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
