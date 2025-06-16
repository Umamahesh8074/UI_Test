import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadbudgetComponent } from './leadbudget.component';

describe('LeadbudgetComponent', () => {
  let component: LeadbudgetComponent;
  let fixture: ComponentFixture<LeadbudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadbudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadbudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
