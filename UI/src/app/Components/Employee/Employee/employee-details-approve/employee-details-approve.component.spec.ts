import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailsApproveComponent } from './employee-details-approve.component';

describe('EmployeeDetailsApproveComponent', () => {
  let component: EmployeeDetailsApproveComponent;
  let fixture: ComponentFixture<EmployeeDetailsApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeDetailsApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailsApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
