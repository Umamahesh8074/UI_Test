import { TestBed } from '@angular/core/testing';

import { CrmDocumentsService } from './crm-documents.service';

describe('CrmDocumentsService', () => {
  let service: CrmDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrmDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
