import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayqrtransactiondataComponent } from './display-qrtransactiondata.component';



describe('DisplayQrtransactiondataComponent', () => {
  let component: DisplayqrtransactiondataComponent;
  let fixture: ComponentFixture<DisplayqrtransactiondataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayqrtransactiondataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayqrtransactiondataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
