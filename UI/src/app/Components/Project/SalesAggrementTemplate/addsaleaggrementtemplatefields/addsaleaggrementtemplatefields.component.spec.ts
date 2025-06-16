import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsaleaggrementtemplatefieldsComponent } from './addsaleaggrementtemplatefields.component';

describe('AddsaleaggrementtemplatefieldsComponent', () => {
  let component: AddsaleaggrementtemplatefieldsComponent;
  let fixture: ComponentFixture<AddsaleaggrementtemplatefieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsaleaggrementtemplatefieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsaleaggrementtemplatefieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
