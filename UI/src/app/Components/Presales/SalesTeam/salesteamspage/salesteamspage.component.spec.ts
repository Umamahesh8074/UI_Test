import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesteamspageComponent } from './salesteamspage.component';

describe('SalesteamspageComponent', () => {
  let component: SalesteamspageComponent;
  let fixture: ComponentFixture<SalesteamspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesteamspageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesteamspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
