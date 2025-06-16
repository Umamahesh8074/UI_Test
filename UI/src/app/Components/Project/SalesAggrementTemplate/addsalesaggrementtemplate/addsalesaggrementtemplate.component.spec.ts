import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsalesaggrementtemplateComponent } from './addsalesaggrementtemplate.component';

describe('AddsalesaggrementtemplateComponent', () => {
  let component: AddsalesaggrementtemplateComponent;
  let fixture: ComponentFixture<AddsalesaggrementtemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsalesaggrementtemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsalesaggrementtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
