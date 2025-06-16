import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualleadassignComponent } from './manualleadassign.component';

describe('ManualleadassignComponent', () => {
  let component: ManualleadassignComponent;
  let fixture: ComponentFixture<ManualleadassignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualleadassignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualleadassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
