import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCpDocumentsComponent } from './display-cp-documents.component';

describe('DisplayCpDocumentsComponent', () => {
  let component: DisplayCpDocumentsComponent;
  let fixture: ComponentFixture<DisplayCpDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayCpDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayCpDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
