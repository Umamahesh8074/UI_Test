import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorepanelComponent } from './display-store.component';

describe('StorepanelComponent', () => {
  let component: StorepanelComponent;
  let fixture: ComponentFixture<StorepanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorepanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
