import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayapprovalsComponent } from './display-approvals.component';

describe('DisplayApprovalsComponent', () => {
  let component: DisplayapprovalsComponent;
  let fixture: ComponentFixture<DisplayapprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayapprovalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayapprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
