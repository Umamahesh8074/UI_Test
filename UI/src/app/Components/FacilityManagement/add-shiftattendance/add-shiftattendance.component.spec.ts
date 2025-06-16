import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftAttendanceComponent } from './add-shiftattendance.component';

describe('AddAttendanceComponent', () => {
  let component: AddShiftAttendanceComponent;
  let fixture: ComponentFixture<AddShiftAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShiftAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShiftAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // describe('AddAttendanceComponent', () => {
  //   it('should create', () => {
  //     cy.visit('http://localhost:4200/layout/attendance/addAttendance'); // Adjust URL to where your component is loaded
  //     cy.get('app-add-attendance').should('exist'); // Adjust selector to target your component
  //   });
  // });
  
  // describe('My First Test', () => {
  //   it('Does not do much!', () => {
  //     expect(true).to.equal(true)
  //   })
  // })
  // describe('My First Test', () => {
  //   it('Does not do much!', () => {
  //     expect(true).to.equal(false)
  //   })
  // })
});
