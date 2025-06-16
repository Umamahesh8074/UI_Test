import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssuesComponent } from './issues.component';

describe('IssuesComponent', () => {
  let component: AddIssuesComponent;
  let fixture: ComponentFixture<AddIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIssuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
