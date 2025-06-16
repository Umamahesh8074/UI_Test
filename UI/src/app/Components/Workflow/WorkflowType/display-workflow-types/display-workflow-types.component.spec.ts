import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayWorkflowTypesComponent } from './display-workflow-types.component';

describe('DisplayWorkflowTypesComponent', () => {
  let component: DisplayWorkflowTypesComponent;
  let fixture: ComponentFixture<DisplayWorkflowTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayWorkflowTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayWorkflowTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
