import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaycommonreferencedetailsComponent } from './displaycommonreferencedetails.component';

describe('DisplaycommonreferencedetailsComponent', () => {
  let component: DisplaycommonreferencedetailsComponent;
  let fixture: ComponentFixture<DisplaycommonreferencedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaycommonreferencedetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaycommonreferencedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
