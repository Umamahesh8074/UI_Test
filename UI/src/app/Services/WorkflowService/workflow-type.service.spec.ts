import { TestBed } from '@angular/core/testing';

import { WorkflowTypeService } from './workflow-type.service';

describe('WorkflowTypeService', () => {
  let service: WorkflowTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
