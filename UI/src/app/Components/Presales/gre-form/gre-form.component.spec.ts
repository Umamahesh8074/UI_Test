import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreFormComponent } from './gre-form.component';

describe('GreFormComponent', () => {
  let component: GreFormComponent;
  let fixture: ComponentFixture<GreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
