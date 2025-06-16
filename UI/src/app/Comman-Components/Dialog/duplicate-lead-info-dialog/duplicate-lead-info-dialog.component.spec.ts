import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateLeadInfoDialogComponent } from './duplicate-lead-info-dialog.component';

describe('DuplicateLeadInfoDialogComponent', () => {
  let component: DuplicateLeadInfoDialogComponent;
  let fixture: ComponentFixture<DuplicateLeadInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateLeadInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateLeadInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
