import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddclientinvoicereportComponent } from './clientinvoicereport.component';



describe('ClientinvoicereportComponent', () => {
  let component:  AddclientinvoicereportComponent;
  let fixture: ComponentFixture<AddclientinvoicereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  AddclientinvoicereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddclientinvoicereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
