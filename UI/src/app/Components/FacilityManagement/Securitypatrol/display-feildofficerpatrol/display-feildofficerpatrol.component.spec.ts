import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFeildofficerpatrolComponent } from './display-feildofficerpatrol.component';

describe('DisplayFeildofficerpatrolComponent', () => {
  let component: DisplayFeildofficerpatrolComponent;
  let fixture: ComponentFixture<DisplayFeildofficerpatrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayFeildofficerpatrolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayFeildofficerpatrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
