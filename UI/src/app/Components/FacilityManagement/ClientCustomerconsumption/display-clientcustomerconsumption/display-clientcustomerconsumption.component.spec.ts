import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayClientcustomerconsumptionComponent } from './display-clientcustomerconsumption.component';



describe('DisplayCustomerconsumptionComponent', () => {
  let component: DisplayClientcustomerconsumptionComponent;
  let fixture: ComponentFixture<DisplayClientcustomerconsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayClientcustomerconsumptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayClientcustomerconsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
