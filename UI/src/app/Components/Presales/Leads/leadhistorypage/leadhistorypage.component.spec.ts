import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadhistorypageComponent } from './leadhistorypage.component';

describe('LeadhistorypageComponent', () => {
  let component: LeadhistorypageComponent;
  let fixture: ComponentFixture<LeadhistorypageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadhistorypageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadhistorypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
