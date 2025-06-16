import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSourceComponent } from './leadsource.component';

describe('AddSourceComponent', () => {
  let component: LeadSourceComponent;
  let fixture: ComponentFixture<LeadSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
