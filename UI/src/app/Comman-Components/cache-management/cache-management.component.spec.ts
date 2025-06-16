import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheManagementComponent } from './cache-management.component';

describe('CacheManagementComponent', () => {
  let component: CacheManagementComponent;
  let fixture: ComponentFixture<CacheManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CacheManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CacheManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
