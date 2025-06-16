import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignApplicantsToCrmmembersComponent } from './assign-applicants-to-crmmembers.component';

describe('AssignApplicantsToCrmmembersComponent', () => {
  let component: AssignApplicantsToCrmmembersComponent;
  let fixture: ComponentFixture<AssignApplicantsToCrmmembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignApplicantsToCrmmembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignApplicantsToCrmmembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
