import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerstagesdisplayComponent } from './customerstagesdisplay.component';

describe('CustomerstagesdisplayComponent', () => {
  let component: CustomerstagesdisplayComponent;
  let fixture: ComponentFixture<CustomerstagesdisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerstagesdisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerstagesdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
