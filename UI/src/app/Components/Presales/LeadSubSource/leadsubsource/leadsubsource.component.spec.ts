import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSubSourceComponent } from './leadsubsource.component';

describe('AddSourceComponent', () => {
  let component: LeadSubSourceComponent;
  let fixture: ComponentFixture<LeadSubSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadSubSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadSubSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
