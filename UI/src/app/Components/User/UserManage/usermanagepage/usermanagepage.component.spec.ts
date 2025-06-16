import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermanagepageComponent } from './usermanagepage.component';

describe('UsermanagepageComponent', () => {
  let component: UsermanagepageComponent;
  let fixture: ComponentFixture<UsermanagepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsermanagepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsermanagepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
