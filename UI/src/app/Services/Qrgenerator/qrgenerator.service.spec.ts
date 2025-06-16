import { TestBed } from '@angular/core/testing';

import { QrgeneratorService } from './qrgenerator.service';

describe('QrgeneratorService', () => {
  let service: QrgeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrgeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
