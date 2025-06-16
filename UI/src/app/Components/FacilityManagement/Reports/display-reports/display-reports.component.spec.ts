import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayreportsComponent } from './display-reports.component';



describe('DisplayReportsComponent', () => {
  let component: DisplayreportsComponent;
  let fixture: ComponentFixture<DisplayreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayreportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
