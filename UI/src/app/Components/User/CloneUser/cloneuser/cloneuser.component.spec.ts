import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneuserComponent } from './cloneuser.component';

describe('CloneuserComponent', () => {
  let component: CloneuserComponent;
  let fixture: ComponentFixture<CloneuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
