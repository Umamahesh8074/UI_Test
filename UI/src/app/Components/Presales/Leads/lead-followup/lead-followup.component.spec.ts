import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadFollowupComponent } from './lead-followup.component';

describe('LeadFollowupComponent', () => {
  let component: LeadFollowupComponent;
  let fixture: ComponentFixture<LeadFollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadFollowupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
