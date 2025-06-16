import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayCustomerStagesComponent } from './displayCustomerStages.component';

describe('DisplayCustomerStagesComponent', () => {
  let component: DisplayCustomerStagesComponent;
  let fixture: ComponentFixture<DisplayCustomerStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayCustomerStagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayCustomerStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
