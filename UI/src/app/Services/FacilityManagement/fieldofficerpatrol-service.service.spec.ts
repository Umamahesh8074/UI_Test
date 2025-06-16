import { TestBed } from '@angular/core/testing';

import { FieldofficerpatrolServiceService } from './fieldofficerpatrol-service.service';

describe('FieldofficerpatrolServiceService', () => {
  let service: FieldofficerpatrolServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldofficerpatrolServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
