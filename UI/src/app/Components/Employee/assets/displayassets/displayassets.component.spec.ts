import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayassertsComponent } from './displayassets.component';

describe('DisplayassertsComponent', () => {
  let component: DisplayassertsComponent;
  let fixture: ComponentFixture<DisplayassertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayassertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayassertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
