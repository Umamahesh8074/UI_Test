import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerconsumptionComponent } from './customerconsumption.component';



describe('CustomerconsumptionComponent', () => {
  let component: AddCustomerconsumptionComponent;
  let fixture: ComponentFixture<AddCustomerconsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerconsumptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCustomerconsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
