import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttendanceComponent } from './add-attendance.component';

describe('AddAttendanceComponent', () => {
  let component: AddAttendanceComponent;
  let fixture: ComponentFixture<AddAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAttendanceComponent);
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
