import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplaycustomerconsumptionComponent } from './display-customerconsumption.component';


describe('DisplayCustomerconsumptionComponent', () => {
  let component: DisplaycustomerconsumptionComponent;
  let fixture: ComponentFixture<DisplaycustomerconsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaycustomerconsumptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaycustomerconsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
