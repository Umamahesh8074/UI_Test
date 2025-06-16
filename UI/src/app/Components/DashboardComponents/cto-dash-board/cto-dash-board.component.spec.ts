import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtoDashBoardComponent } from './cto-dash-board.component';

describe('CtoDashBoardComponent', () => {
  let component: CtoDashBoardComponent;
  let fixture: ComponentFixture<CtoDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtoDashBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtoDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
