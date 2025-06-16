import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddQrtransactiondataComponent } from './qrtransactiondata.component';



describe('QrtransactiondataComponent', () => {
  let component: AddQrtransactiondataComponent;
  let fixture: ComponentFixture<AddQrtransactiondataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQrtransactiondataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQrtransactiondataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
