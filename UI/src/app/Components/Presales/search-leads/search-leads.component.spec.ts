import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLeadsComponent } from './search-leads.component';

describe('SearchLeadsComponent', () => {
  let component: SearchLeadsComponent;
  let fixture: ComponentFixture<SearchLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
