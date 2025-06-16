import { TestBed } from '@angular/core/testing';

import { ItemSubCategoryService } from './item-sub-category.service';

describe('ItemSubCategoryService', () => {
  let service: ItemSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
