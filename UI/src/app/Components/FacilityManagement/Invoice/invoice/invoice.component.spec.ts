import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddInvoiceComponent } from './Invoice.component';




describe('InvoiceComponent', () => {
  let component:  AddInvoiceComponent;
  let fixture: ComponentFixture< AddInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  AddInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent( AddInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
