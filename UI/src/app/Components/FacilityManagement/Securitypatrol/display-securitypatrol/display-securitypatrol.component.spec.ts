import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplaysecuritypatrolComponent } from './display-Securitypatrol.component';


describe('DisplaySecuritypatrolComponent', () => {
  let component: DisplaysecuritypatrolComponent;
  let fixture: ComponentFixture<DisplaysecuritypatrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaysecuritypatrolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaysecuritypatrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
