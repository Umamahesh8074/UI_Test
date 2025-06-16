import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerdocumentdisplayComponent } from './customerdocumentdisplay.component';

describe('CustomerdocumentdisplayComponent', () => {
  let component: CustomerdocumentdisplayComponent;
  let fixture: ComponentFixture<CustomerdocumentdisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerdocumentdisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerdocumentdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
