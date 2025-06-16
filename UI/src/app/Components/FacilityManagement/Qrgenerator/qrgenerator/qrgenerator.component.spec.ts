import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddQrgeneratorComponent } from './qrgenerator.component';




describe('QrgeneratorComponent', () => {
  let component: AddQrgeneratorComponent;
  let fixture: ComponentFixture<AddQrgeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQrgeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQrgeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
