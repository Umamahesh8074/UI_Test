import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadreportpageComponent } from './leadreportpage.component';

describe('LeadreportpageComponent', () => {
  let component: LeadreportpageComponent;
  let fixture: ComponentFixture<LeadreportpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadreportpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadreportpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
