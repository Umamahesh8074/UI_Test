import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EoiComponent } from './eoi.component';

describe('EoiComponent', () => {
  let component: EoiComponent;
  let fixture: ComponentFixture<EoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EoiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
