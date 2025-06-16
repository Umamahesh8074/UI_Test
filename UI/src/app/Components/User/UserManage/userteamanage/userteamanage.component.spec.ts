import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserteamanageComponent } from './userteamanage.component';

describe('UserteamanageComponent', () => {
  let component: UserteamanageComponent;
  let fixture: ComponentFixture<UserteamanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserteamanageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserteamanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
