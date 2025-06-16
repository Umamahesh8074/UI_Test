import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddstoreinventoryComponent } from './addstoreinventory.component';

describe('AddstoreinventoryComponent', () => {
  let component: AddstoreinventoryComponent;
  let fixture: ComponentFixture<AddstoreinventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddstoreinventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddstoreinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
