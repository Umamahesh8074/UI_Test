import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnusReportComponent } from './magnus-report.component';

describe('MagnusReportComponent', () => {
  let component: MagnusReportComponent;
  let fixture: ComponentFixture<MagnusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagnusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagnusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
