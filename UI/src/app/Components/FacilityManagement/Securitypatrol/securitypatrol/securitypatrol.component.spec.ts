import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSecuritypatrolComponent } from './Securitypatrol.component';




describe('SecuritypatrolComponent', () => {
  let component: AddSecuritypatrolComponent;
  let fixture: ComponentFixture<AddSecuritypatrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSecuritypatrolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSecuritypatrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
