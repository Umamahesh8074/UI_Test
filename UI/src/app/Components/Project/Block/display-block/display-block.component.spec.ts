import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayblockComponent } from './display-block.component';

describe('DisplayBlockComponent', () => {
  let component: DisplayblockComponent;
  let fixture: ComponentFixture<DisplayblockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayblockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
