import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFollowupsComponent } from './dashboard-followups.component';

describe('DashboardFollowupsComponent', () => {
  let component: DashboardFollowupsComponent;
  let fixture: ComponentFixture<DashboardFollowupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardFollowupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardFollowupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
