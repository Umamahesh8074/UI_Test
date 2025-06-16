import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmenuitemComponent } from './addmenuitem.component';

describe('AddmenuitemComponent', () => {
  let component: AddmenuitemComponent;
  let fixture: ComponentFixture<AddmenuitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmenuitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmenuitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
