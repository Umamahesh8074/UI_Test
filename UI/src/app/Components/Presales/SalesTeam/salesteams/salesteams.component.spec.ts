import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesteamsComponent } from './salesteams.component';

describe('SalesteamsComponent', () => {
  let component: SalesteamsComponent;
  let fixture: ComponentFixture<SalesteamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesteamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
