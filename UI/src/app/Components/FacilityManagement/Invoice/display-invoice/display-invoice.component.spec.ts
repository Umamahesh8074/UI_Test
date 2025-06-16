import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayinvoiceComponent } from './display-Invoice.component';


describe('DisplayInvoiceComponent', () => {
  let component: DisplayinvoiceComponent;
  let fixture: ComponentFixture<DisplayinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayinvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
