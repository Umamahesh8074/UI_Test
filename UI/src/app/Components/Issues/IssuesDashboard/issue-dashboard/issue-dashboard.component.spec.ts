import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDashboardComponent } from './issue-dashboard.component';

describe('IssueDashboardComponent', () => {
  let component: IssueDashboardComponent;
  let fixture: ComponentFixture<IssueDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
