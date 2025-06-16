import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolemanageComponent } from './rolemanage.component';

describe('RolemanageComponent', () => {
  let component: RolemanageComponent;
  let fixture: ComponentFixture<RolemanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolemanageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
