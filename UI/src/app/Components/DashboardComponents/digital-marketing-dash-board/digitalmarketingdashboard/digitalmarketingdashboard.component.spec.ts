import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalmarketingdashboardComponent } from './digitalmarketingdashboard.component';

describe('DigitalmarketingdashboardComponent', () => {
  let component: DigitalmarketingdashboardComponent;
  let fixture: ComponentFixture<DigitalmarketingdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalmarketingdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalmarketingdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
