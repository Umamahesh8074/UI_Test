import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolepermissiondisplayComponent } from './rolepermissiondisplay.component';

describe('RolepermissiondisplayComponent', () => {
  let component: RolepermissiondisplayComponent;
  let fixture: ComponentFixture<RolepermissiondisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolepermissiondisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolepermissiondisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
