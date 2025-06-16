import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratesalesaggrementComponent } from './generatesalesaggrement.component';

describe('GeneratesalesaggrementComponent', () => {
  let component: GeneratesalesaggrementComponent;
  let fixture: ComponentFixture<GeneratesalesaggrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratesalesaggrementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratesalesaggrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
