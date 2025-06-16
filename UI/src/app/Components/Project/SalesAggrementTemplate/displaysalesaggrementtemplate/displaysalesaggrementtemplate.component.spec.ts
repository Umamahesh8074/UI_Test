import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaysalesaggrementtemplateComponent } from './displaysalesaggrementtemplate.component';

describe('DisplaysalesaggrementtemplateComponent', () => {
  let component: DisplaysalesaggrementtemplateComponent;
  let fixture: ComponentFixture<DisplaysalesaggrementtemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaysalesaggrementtemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaysalesaggrementtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
