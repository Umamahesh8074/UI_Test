import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaydocumentsComponent } from './displaydocuments.component';

describe('DisplaydocumentsComponent', () => {
  let component: DisplaydocumentsComponent;
  let fixture: ComponentFixture<DisplaydocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaydocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaydocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
