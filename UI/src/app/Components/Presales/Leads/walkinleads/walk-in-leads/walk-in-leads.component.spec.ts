import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkInLeadsComponent } from './walk-in-leads.component';

describe('WalkInLeadsComponent', () => {
  let component: WalkInLeadsComponent;
  let fixture: ComponentFixture<WalkInLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkInLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalkInLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
