import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddClientCustomerconsumptionComponent  } from './clientcustomerconsumption.component';





describe('CustomerconsumptionComponent', () => {
  let component: AddClientCustomerconsumptionComponent;
  let fixture: ComponentFixture<AddClientCustomerconsumptionComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClientCustomerconsumptionComponent  ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClientCustomerconsumptionComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
