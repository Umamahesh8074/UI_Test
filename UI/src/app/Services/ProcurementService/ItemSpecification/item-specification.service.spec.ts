import { TestBed } from '@angular/core/testing';

import { ItemSpecificationService } from './item-specification.service';

describe('ItemSpecificationService', () => {
  let service: ItemSpecificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemSpecificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
