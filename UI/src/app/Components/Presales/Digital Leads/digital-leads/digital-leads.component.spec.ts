import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalLeadsComponent } from './digital-leads.component';

describe('DigitalLeadsComponent', () => {
  let component: DigitalLeadsComponent;
  let fixture: ComponentFixture<DigitalLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
