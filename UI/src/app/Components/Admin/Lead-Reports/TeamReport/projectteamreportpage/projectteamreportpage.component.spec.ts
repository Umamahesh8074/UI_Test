import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectteamreportpageComponent } from './projectteamreportpage.component';

describe('ProjectteamreportpageComponent', () => {
  let component: ProjectteamreportpageComponent;
  let fixture: ComponentFixture<ProjectteamreportpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectteamreportpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectteamreportpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
