import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadbudgetpageComponent } from './leadbudgetpage.component';

describe('LeadbudgetpageComponent', () => {
  let component: LeadbudgetpageComponent;
  let fixture: ComponentFixture<LeadbudgetpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadbudgetpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadbudgetpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
