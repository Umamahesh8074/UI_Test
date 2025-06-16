import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWorkflowstageComponent } from './Workflowstage.component';

describe('WorkflowstageComponent', () => {
  let component: AddWorkflowstageComponent;
  let fixture: ComponentFixture<AddWorkflowstageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWorkflowstageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddWorkflowstageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
