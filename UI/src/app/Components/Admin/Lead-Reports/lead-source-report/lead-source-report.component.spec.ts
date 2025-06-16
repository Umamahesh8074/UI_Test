import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSourceReportComponent } from './lead-source-report.component';

describe('LeadSourceReportComponent', () => {
  let component: LeadSourceReportComponent;
  let fixture: ComponentFixture<LeadSourceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadSourceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadSourceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
