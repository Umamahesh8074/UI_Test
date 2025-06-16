import { TestBed } from '@angular/core/testing';

import { WorkflowstageService } from './workflowstage.service';

describe('WorkflowstageService', () => {
  let service: WorkflowstageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowstageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
