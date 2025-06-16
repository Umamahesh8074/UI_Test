import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPDashBoardComponent } from './cpdash-board.component';

describe('CPDashBoardComponent', () => {
  let component: CPDashBoardComponent;
  let fixture: ComponentFixture<CPDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPDashBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
