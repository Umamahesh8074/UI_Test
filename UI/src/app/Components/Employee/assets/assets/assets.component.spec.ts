import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertsComponent } from './assets.component';

describe('AssertsComponent', () => {
  let component: AssertsComponent;
  let fixture: ComponentFixture<AssertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
