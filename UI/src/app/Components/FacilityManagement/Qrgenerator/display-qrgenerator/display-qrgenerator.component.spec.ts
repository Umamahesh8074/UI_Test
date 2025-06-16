import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayqrgeneratorComponent } from './display-qrgenerator.component';



describe('DisplayQrgeneratorComponent', () => {
  let component: DisplayqrgeneratorComponent;
  let fixture: ComponentFixture<DisplayqrgeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayqrgeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayqrgeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
