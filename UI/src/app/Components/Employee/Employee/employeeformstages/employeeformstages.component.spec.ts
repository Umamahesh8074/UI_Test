import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeformstagesComponent } from './employeeformstages.component';

describe('EmployeeformstagesComponent', () => {
  let component: EmployeeformstagesComponent;
  let fixture: ComponentFixture<EmployeeformstagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeformstagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeformstagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
